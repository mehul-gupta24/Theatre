import axios from "axios"
import Movie from "../models/Movie.js"
import Show from "../models/Show.js"

// API to get now playing movies from TMBD api
export const getNowPlaying = async (req, res) => {
    try{
        // const {data} = await axios.get(`https://api.themoviedb.org/3/movie/`,{
        const {data} = await axios.get('https://api.themoviedb.org/3/movie/now_playing',
            {headers : {Authorization: `Bearer ${process.env.TMDB_API_KEY}`}
        })
        const movies = data.results
        res.json({success : true, movies : movies})
    }
    catch(err){
        console.log(err)
        res.json({success : false, message : err.message})
    }
}

// api to add a new show to a database
export const addShow = async (req,res) => {
    try{
        
        const {movieId, showsInput, showPrice} = req.body;
        let movie = await Movie.findById(movieId);

        if(!movie){
            //means mongoose doesnt have this movie details , so need to fetch it from TMDB api key
            // const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
            //     axios.get(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,{
            //         headers : {Authorization: `Bearer ${process.env.TMDB_API_KEY}`}
            //     }),
            //     axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,{
            //         headers : {Authorization: `Bearer ${process.env.TMDB_API_KEY}`}
            //     })
            // ])
            const movieDetailsResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
                { headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` } }
            );

            const movieCreditsResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,
                { headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` } }
            );


            const movieApiData = movieDetailsResponse.data;
            const movieCreditsData = movieCreditsResponse.data;
            const movieDetails = {
                _id : movieId,
                title : movieApiData.title,
                overview : movieApiData.overview,
                poster_path : movieApiData.poster_path,
                backdrop_path : movieApiData.backdrop_path,
                release_date : movieApiData.release_date,
                original_language : movieApiData.original_language,
                tagline : movieApiData.tagline || "",
                genres : movieApiData.genres,
                casts : movieCreditsData.cast,
                // casts : movieApiData.cast,
                vote_average : movieApiData.vote_average,
                runtime : movieApiData.runtime,
            }

            //add movie to databsee
            movie = await Movie.create(movieDetails)
        }

        const showsToCreate = [];
        showsInput.forEach(show => {
            const showDate = show.date;
            show.time.forEach(time => {
                const dateTimeString = `${showDate}T${time}`
                showsToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice: showPrice,
                    occupiedSeats : {}
                });
            })
        });
        if(showsToCreate.length > 0){
            await Show.insertMany(showsToCreate)
        }
        res.json({success : true, message : "Show Added Successfully"})
    }
    catch(err){
        console.log(err)
        res.json({success : false, message : err.message})

    }
}

//API to get all shows from the database
export const getShows = async(req, res) => {
    try {
        const shows = await Show.find({showDateTime : {$gte : new Date()} })
                                .populate('movie')
                                .sort({showDateTime : 1})
        //filter unique shows
        // const uniqueShows = new Set(shows.map(show => show.movie))
        const uniqueShows = new Set(shows.map(show => show.movie))

        res.json({success : true, shows: Array.from(uniqueShows)})
        
    } catch (err) {
        console.log(err)
        res.json({success : false, message : err.message})
    }
}

//API to get a single show from the database
export const getShow = async(req, res) => {
    try {
        const {movieId} = req.params;
        //get all upcoming shows for the movie
        const shows = await Show.find({movie:movieId, showDateTime:{$gte : new Date()}})
        const movie = await Movie.findById(movieId)
        const dateTime = {}
        shows.forEach((show)=>{
            const date = show.showDateTime.toISOString().split("T")[0];
            if(!dateTime[date]){
                dateTime[date]=[]
            }
            dateTime[date].push({time : show.showDateTime, showId : show._id});
        })
        res.json({success : true, movie, dateTime})
        
    } catch (err) {
        console.log(err)
        res.json({success : true, message : err.message})
    }
}

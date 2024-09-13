const { getMaxListeners } = require("../models/blog");

const dummy = (blogs) => {
    return 1;
  }
  
  const totalLikes = (blogs) => {
    const totalLikesCount = blogs.reduce((sum,post) => sum + post.likes, 0);
    
    return totalLikesCount;
}   
const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null;
    return blogs.reduce((max,blog) => (blog.likes > max.likes ? blog : max)); 
}




  module.exports = {
    dummy, totalLikes, favoriteBlog
  }



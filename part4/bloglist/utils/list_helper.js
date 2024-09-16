const { getMaxListeners } = require("../models/blog");
const lodash = require('lodash');

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

const getBlogsPerAuthor = (blogs) => {
  let dictAuthors = {}
  if (blogs.length === 0) return null;
  blogs.forEach(blog => {
    if (blog.author in dictAuthors){
      dictAuthors[blog.author] += 1;
    }else{
      dictAuthors[blog.author] = 1;
    }
  })
  return dictAuthors;
}

const mostBlogs_old = (blogs) => {
  let dictAuthors = getBlogsPerAuthor(blogs);
  let topAuthor = null;
  let maxBlogs = 0;

  for (const author in dictAuthors){
    if (dictAuthors[author] > maxBlogs){
      maxBlogs = dictAuthors[author];
      topAuthor = author;
    }
  } 
  return {author: topAuthor, blogs: maxBlogs};
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {author:null,blogs:0};
  const blogsByAuthor = lodash.groupBy(blogs, "author");
  console.log(blogsByAuthor)
  const blogsCount = lodash.map(blogsByAuthor, (author,blogList) => ({
    author: author,
    blogs: blogList.length
  }));
  return(lodash.maxBy(blogsCount,"blogs"));
}


const mostLikes = (blogs) => {
  if (blogs.length === 0) return {author:null,likes:0};
  const blogsByAuthor = lodash.groupBy(blogs, "author");
  const authorLikes = lodash.map(blogsByAuthor, (blogList, author) => ({
    author: author,
    likes: blogList.reduce((sum,post) => sum + post.likes, 0)
  }))
  return(lodash.maxBy(authorLikes,"likes"));  
}




  module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
  }



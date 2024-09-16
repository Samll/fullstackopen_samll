const info = (...params) => {
  if (process.env.NODE_ENV !== 'testm') { 
    console.log(...params)
  }
  }
  
  const error = (...params) => {
    if (process.env.NODE_ENV !== 'testm') { 
      console.error(...params)
    }
  }
  
  module.exports = {
    info, error
  }
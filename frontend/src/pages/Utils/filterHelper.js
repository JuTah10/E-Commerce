//generate unique values from a table of data 
export const generateUniqueValues  = (data, columnId) => {
    const columnValues = data.map(row => row[columnId])
    return ([... new Set(columnValues)])
}

function optimizeImageUrl(url) {
  if (url.includes("res.cloudinary.com")) {
    return url.replace(/\/upload\//, "/upload/c_scale,w_150/");
  }
  if (url.includes("cloutcloset.com")) {
    return url.replace(/width=\d+/, "width=100");
  }
  return url;
}

// Given your existing `data` array, produce a new array with optimized image URLs:
export const optimizedData = data =>
    data
      .map(item => ({
        ...item,
        image: optimizeImageUrl(item.image),
      }))
      .sort((a, b) => a.id.localeCompare(b.id))

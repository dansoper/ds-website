function yearShortcode() {
    let d = new Date();
    return d.getFullYear() + "";
}
  
module.exports = yearShortcode;

module.exports = {
  getDate: () => {
    let today = new Date();
    let options = {
      weekday: "long",
      day: "numeric",
      month: "long"
    };

    return today.toLocaleDateString("en-AR", options);
  },

  getDay: () => {
    let today = new Date();
    let options = {
      day: "numeric"
    };

    return today.toLocaleDateString("en-AR", options);
  }
};

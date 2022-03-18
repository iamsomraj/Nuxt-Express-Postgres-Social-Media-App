const Person = require("../../models/Person.js");
const asyncHandler = require("express-async-handler");

/**
 * @access private
 * @description fetches every detail about one person by id
 * @route GET /api/v1/persons/:id
 */
const getPersonProfile = asyncHandler(async (req, res) => {
  let person, id;
  /**
   * If the same person is asking for his own profile,
   * then no further request is made to fetch person details
   */
  if (req.user.id == req.params.id) {
    person = { ...req.user };
    id = parseInt(person.id);
  } else {
    id = parseInt(req.params.id);
    person = await Person.query().findOne({ id });
  }

  if (person) {
    const posts = await Person.relatedQuery("posts").for(id);
    const followers = await Person.relatedQuery("followers").for(id);
    const followings = await Person.relatedQuery("followings").for(id);
    const likes = await Person.relatedQuery("likes").for(id);

    res.json({
      id: person.id,
      name: person.name,
      email: person.email,
      posts,
      followers,
      followings,
      likes,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = getPersonProfile;

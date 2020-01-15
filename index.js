const express = require('express');
const app = express();

const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');

// data
const {courses} = require('./data.json')

const schema = buildSchema(`
  type Query {
    course(id: Int!): Course
    courses(topic: String): [Course]
    message: String
  }

  type Mutation {
    updateCourseTopic(id: Int!, topic: String!): Course
  }

  type Course {
    id: Int
    title: String
    description: String
    author: String
    topic: String
    url: String
  }
`);

let getCourse = (args) => {
  let id = args.id;
  return courses.filter((item) => item.id == id)[0]
}

let getCourses = (args) => {
  if (args.topic) {
    let topic = args.topic;
    return courses.filter(course => course.topic == topic)
  } else {
    return courses;
  }
}

let updateCourseTopic = ({id, topic}) => {
  courses.map(course => {
    if (course.id === id) {
      course.topic = topic;
      return course
    }
  })

  return courses.filter(course => course.id === id)[0]
}

const root = {
  message: () => "Hello world!",
  course: getCourse,
  courses : getCourses,
  updateCourseTopic: updateCourseTopic
}

app.use('/graphql', express_graphql({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

app.listen(3000, () => {
  console.log('Server running');
})


/* Queries */
/* 
query twoCourses ($courseID1: Int!, $courseID2: Int!) {
  course1: course(id: $courseID1) {
    ...courseFields
  }
  course2: course(id: $courseID2) {
    ...courseFields
  }
}

fragment courseFields on Course {
  author
  topic
  url
  title
}

Query Variables---->
{
  "courseID1": 3,
  "courseID2": 1
}
_________________________


mutation updateCourseTopic($idCourse: Int!, $topicCourse: String!) {
  updateCourseTopic(id: $idCourse, topic: $topicCourse) {
    ...courseFields
  }
}

fragment courseFields on Course {
  author
  topic
  url
  title
}

*/

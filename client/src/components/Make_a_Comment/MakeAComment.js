import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../helpers/Context'
import './MakeAComment.scss'
import Card from 'react-bootstrap/Card'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import alumniData from '../navbar/akumniData.json'

const MakeAComment = () => {
  const { result, user, profile, setProfile, setResult } = useContext(
    LoginContext,
  )
  const [userData, setUserData] = useState({})
  const [comment, setComment] = useState()
  const { loading, setLoading } = useContext(LoginContext)
  const [name, setName] = useState('')
  const [isStudent, setIsStudent] = useState(false)
  const [approvedComments, setApprovedComments] = useState([])

  const alumniEmail = alumniData

  useEffect(() => {
    if (alumniEmail.includes(user.email)) {
      setIsStudent(false)
    } else {
      setIsStudent(true)
    }
  })
  console.log(result)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    const Load = async () => {
      await new Promise((r) => setTimeout(r, 1000))

      setLoading((loading) => !loading)
    }

    Load()
  }, [])

  //Get the data to be displayed on the profile
  useEffect(() => {
    axios
      .post('http://localhost:5000/profile', {
        email: user.email,
      })
      .then((res) => {
        setUserData(res.data.User)
      })
  })

  //After refreshing the page user is still signed in
  useEffect(() => {
    if (window.localStorage.getItem('searchAlumni') !== null) {
      const searchAlumni = window.localStorage.getItem('searchAlumni')
      if (searchAlumni !== null) {
        setResult(JSON.parse(searchAlumni))
      }
    }
  }, [])

  //Add comment in the comment section of user who makes a comment
  //and new comment of comment section on whom the comment is being made
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isStudent === false) {
      await axios
        .post('http://localhost:5000/myComments', {
          comment: comment,
          friend_email: result[0].email,
          friend_name: result[0].name,
          user_email: userData[0].email,
        })
        .then((res) => {
          console.log(res.data.message)
        })
        .catch((err) => {
          console.log(err)
        })
    }
    if (isStudent === true) {
      await axios
        .post('http://localhost:5000/newComments', {
          comment: comment,
          user_email: user.email,
          user_name: user.name,
          friend_email: result[0].email,
        })
        .then((res) => {
          console.log(res.data.message)
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      await axios
        .post('http://localhost:5000/newComments', {
          comment: comment,
          user_email: userData[0].email,
          user_name: userData[0].name,
          friend_email: result[0].email,
        })
        .then((res) => {
          console.log(res.data.message)
        })
        .catch((err) => {
          console.log(err)
        })
    }
    if (isStudent === true) {
      navigate('/')
    } else {
      navigate(`/profile/${profile._id}/${profile.name}/${profile.roll_no}`)
    }
    window.localStorage.removeItem('searchAlumni')
  }

  //Getting all the approved comments to be displayed in the approved section
  useEffect(() => {
    axios
      .post('http://localhost:5000/getApprovedComments', {
        friend_email: result.email,
      })
      .then((res) => {
        setApprovedComments(res.data[0].comments)
      })
      .catch((err) => {
        console.log(err)
      })
  })

  return (
    <>
      {loading && (
        <div className="spinner">
          <span class="loader"></span>
        </div>
      )}
      {!loading && (
        <div className="containermc">
          <style>
            @import
            url('https://fonts.googleapis.com/css2?family=Quantico&display=swap');
          </style>
          <div className="container2">
            <div className="left1">
              <span className="dot">
                {result.length && <img id="ip" src={result[0].profile_img} />}
              </span>
              {/* {result.length && (
                <div className="description" id="desc">
                  <h2>{result[0].name}</h2>

                  <h3 style={{ color: 'white' }}>
                    Roll No: {result[0].roll_no}
                  </h3>
                  <h3 style={{ color: 'white' }}>
                    {result[0].academic_program}, {result[0].department}
                  </h3>
                  <h3 style={{ color: 'white' }}>
                    {result[0].current_company}, {result[0].designation}
                  </h3>
                  <h3 style={{ color: 'white' }}>{result[0].about}</h3>
                </div>
              )} */}
              <div className="description" id="desc">
                <h2>Name</h2>

                <h3 style={{ color: 'white' }}>Roll No: 12345678</h3>
                <h3 style={{ color: 'white' }}>BTech, CSE</h3>
                <h3 style={{ color: 'white' }}>Company, designation</h3>
                <h3 style={{ color: 'white' }}>{result[0].about}</h3>
              </div>
            </div>
            <div className="right1">
              <h1 id="make">Make a Comment</h1>
              <form>
                <textarea
                  name="comment"
                  id="commenttext"
                  cols="85"
                  rows="25"
                  placeholder="Add your Comment"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value)
                  }}
                />
                <br />
                <button
                  type="submit"
                  id="post"
                  onClick={handleSubmit}
                  style={{ color: 'white', float: 'right' }}
                >
                  POST!
                </button>
              </form>
            </div>
          </div>

          <div id="apcomments">
            <div style={{ display: 'inline' }}>
              <h1 id="make">Approved Comments</h1>
            </div>
            <div id="cards-container">
              {approvedComments.map((val) => (
                <Card
                  style={{
                    width: '18rem',
                    height: '11rem',
                    margin: '1rem',
                    overflow: 'auto',
                  }}
                >
                  <Card.Img variant="top" />
                  <Card.Body>
                    <Card.Text style={{ paddingBottom: '1rem' }}>
                      {val.comment}
                    </Card.Text>
                    <p id="name" style={{ paddingBottom: '0rem' }}>
                      -{val.user_name}
                    </p>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MakeAComment

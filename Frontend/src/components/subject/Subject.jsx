import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Posts from '../posts/Posts'
import { useLocation, useNavigate } from 'react-router-dom'
import { Context } from '../../context/Context'
const ENP = "http://localhost:8800/api"

export default function Subject() {
    const location = useLocation()
    const path = Number(location.pathname.split("/")[2])
    const { user } = useContext(Context);
    const navigatepath = user.prof_id
    const checker = (path === navigatepath)
    const navigate = useNavigate()
    
    const [ data, setData ] = useState([])

    useEffect(() => {
        const getData = async () => {
            try{
                const timestamp = new Date().getTime()
                const bangkokTime = new Date(timestamp)
                const year = bangkokTime.getFullYear()
                const month = bangkokTime.getMonth() + 1
                const res = await axios.get(`${ENP}/fetchdbs/test/${path}/${year}_${month}/?timestamp=${timestamp}`)
                setData(res.data)
    
            }catch(err){
                console.log(err)
            }
        }
        getData()
    }, [path])

    useEffect(() => {
        if (!checker) {
            navigate('/')
        }
    }, [checker, navigate])

  return (
    <>
    <div>
        {checker ? (
            <Posts sent={data} />
        ) : (
            <p>Redirecting...</p>
        )}
        </div>
    </>
  )
}
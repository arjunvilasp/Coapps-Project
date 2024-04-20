import React from 'react'
import './Slider.css'
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

  
  const divStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'contain',
    backgroundPosition:'center',
    backgroundRepeat:'no-repeat',
    height: '350px',
    marginTop:'20px',
  }

  const slideImages = [
    {
      url: 'https://magesolution.com/wp-content/uploads/2022/07/Limited-Time-offer.png',
      caption: 'Slide 1'
    },
    {
      url: 'https://t3.ftcdn.net/jpg/04/65/46/52/360_F_465465254_1pN9MGrA831idD6zIBL7q8rnZZpUCQTy.jpg',
      caption: 'Slide 2'
    },
    {
      url: 'https://marketplace.canva.com/EAFED0hv9G0/1/0/1600w/canva-blue-pink-modern-special-offer-sale-banner-J5VkNReQ8WA.jpg',
      caption: 'Slide 3'
    },
  ];

const Slider = () => {
  return (
    <div className="slide-container">
    <Slide>
     {slideImages.map((slideImage, index)=> (
        <div key={index}>
          <div style={{ ...divStyle, 'backgroundImage': `url(${slideImage.url})` }}>
          </div>
        </div>
      ))} 
    </Slide>
  </div>
  )
}

export default Slider
import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
    return (
        <div>
            <div className='text-center text-2xl pt-10 text-gray-700'>
                <p>CONTACT US</p>
            </div>

            <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
                <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt = ""/>

                <div className='flex flex-col justify-center gap-6 items-start'>
                    <p className='font-semibold text-lg text-gray-600'>OUR OFFICE</p>
                    <p className='text-gray-500'>1234 Giai Phong <br /> Ha Noi, Viet Nam</p>
                    <p className='text-gray-500'>Tel: +84 0123-456-789 <br /> Email: superclinic@gmail.com</p>
                    <p className='font-semibold text-lg text-gray-600'>Careers at BLOOM</p>
                    <p className='text-gray-500'>Learn more about our teams and job openings.</p>
                    <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-300'>Explore Jobs</button>
                </div>
            </div>
        </div>
    )
}

export default Contact
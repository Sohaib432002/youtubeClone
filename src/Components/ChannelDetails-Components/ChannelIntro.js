
const ChannelIntro = ({ ChannelPic,more,setmore}) => {

  return (
    <>
      <div className="flex  flex-wrap my-[50px] ">
        <div className="flex  channelintroDetails">
        <div className="w-[200px] channelintroDetailsImg h-[200px] rounded-full overflow-hidden flex justify-center items-center">
          <img src={ChannelPic} alt="channelPic" className="rounded-full" />
        </div>
        <div className="flex mx-4 flex-col channelIntro text-white">
          <div className="title text-[37px] font-sans font-extrabold ">
              Syed Muzammil Official
          </div>
          <p>@syedmuzammilofficial7067 <span className="text-gray-400" >•659K subscribers•249 videos</span></p>
          <p className="descipriton text-gray-400 ">
            Syed Muzammil is a Political Scientist and a Prime Time talk show host of his own<span className="opacity-[0.4] "> show</span>
            <span className="text-white font-bold cursor-pointer " onClick={() => { setmore(true) }}>...more</span>
            {more ? <>
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40">

  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  max-w-[400px] w-full p-6
                  bg-gray-800 text-white rounded-xl shadow-lg z-50">
                  <div>
                    <h1 className="text-[20px] my-4 font-extrabold ">Syed Muzammil Official</h1>
                    <hr />
                    <p className="text-[16px] my-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo reprehenderit impedit numquam veniam maiores libero minima, incidunt temporibus labore porro blanditiis animi soluta, voluptates fugiat cupiditate. Similique distinctio enim facere. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut impedit, corrupti illum sapiente nemo laudantium alias quod! Atque natus illo sapiente illum deleniti vero quisquam rerum unde. Asperiores, a rem?</p>
                  <div><button onClick={()=>setmore(false)} >CLose</button></div>
                  </div></div>

           </div>
            </> : ''}
            <div className="my-3 btn-subscribe-pc  justify-start">
              <div className="px-4 font-sans py-2 bg-slate-50 text-black bold hover:bg-slate-300 rounded-full cursor-pointer ">
                <p>Subscribe</p>
              </div>
            </div>
          </p>
          </div>
          </div>
        <div className="my-3 btn-subscribe-mobile   ">
              <div className="px-4 font-sans py-2 bg-slate-50 text-black bold hover:bg-slate-300 rounded-full cursor-pointer ">
                <p>Subscribe</p>
              </div>
            </div>

      </div>
    </>
  )
}

export default ChannelIntro

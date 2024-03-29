import { ethers } from 'ethers'
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router'
import { useStateContext } from '../context'
import { CustomeButton } from '../components'
import { calculateBarPercentage, daysLeft } from '../utils'
import { thirdweb } from '../assets'
import Loader from '../components/Loader'

const CampaignDetails = () => {
  const { state } = useLocation()
  console.log(state)

  const { getDonations, donate, contract, address } = useStateContext()

  const [isLoading, setIsLoading] = useState(false)

  const [amount, setAmount] = useState('')
  const [donators, setDonators] = useState([])

  const remainingDays = daysLeft(state.deadline)
  const fetchDonators = async () => {
    const data = await getDonations(state.id)
    setDonators(data)
  }
  const handleDonate = async () => {
    setIsLoading(true)
    await donate(state.id, amount)
    setIsLoading(false)
  }

  useEffect(() => {
    if (contract) fetchDonators()
  }, [contract, address])

  return (
    <div>
      {isLoading && <Loader></Loader>}
      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img
            src={state.image}
            alt="campaign"
            className="w-full h-[410px] object-cover rounded-xl "
          />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div
              className="absolute h-full bg-[#4acd8d]"
              style={{
                width: `${calculateBarPercentage(
                  state.target,
                  state.amountCollected
                )}%`,
                maxWidth: `100%`,
              }}
            ></div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={remainingDays}></CountBox>
          <CountBox
            title={`Raised of ${state.target}`}
            value={state.amountCollected}
          ></CountBox>
          <CountBox title="Total Backer" value={donators.length}></CountBox>
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex  flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-bold text-[18px] text-white uppercase">
              Creator (发起人)
            </h4>
            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px]  flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img
                  src={thirdweb}
                  alt="user"
                  className="w-[60%] h-[60%] object-contain "
                />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all ">
                  {state.owner}
                </h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                  {' '}
                  10 Campaigns
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-bold text-[18px] text-white uppercase">
              Story （介绍）
            </h4>
            <div className="mt-[20px]">
              <p className=" font-epilogue font-normal text-[16px] leading-[26px] text-[#808191]">
                {state.description}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-bold text-[18px] text-white uppercase">
              Donators (王多鱼)
            </h4>
            <div className="mt-[20px] flex flex-col gap-4">
              {donators.length > 0 ? (
                donators.map((d, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center gap-4"
                  >
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px]">
                      {index + 1}. {d.donator}
                    </p>

                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px]">
                      {d.donation}
                    </p>
                  </div>
                ))
              ) : (
                <p className=" font-epilogue font-normal text-[16px] leading-[26px] text-[#808191]">
                  没有支持者，成为第一个吧！
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-epilogue font-bold text-[18px] text-white uppercase">
            我投了！
          </h4>
          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Fund the Campagin
            </p>

            <div className="mt-[30px] ">
              <input
                type="number"
                palceholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white 
                text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value)
                }}
              />
              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                  我王多鱼投了！
                </h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                  Support the project for no reward, But you will be the founder
                  of the next new big thing
                </p>
              </div>

              <CustomeButton
                btnType="btn"
                styles=" w-full bg-[#8c6dfd]"
                title="Fund"
                handleClick={handleDonate}
              ></CustomeButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails

const CountBox = ({ value, title }) => {
  return (
    <div className="flex flex-col items-center w-[150px]">
      <h4
        className="font-epilogue font-bold text-[30px] text-white p-3 bg-[#1c1c24] rounded-t-[10px] 
        w-full text-center truncate"
      >
        {value}
      </h4>
      <p className="font-epilogue font-normal text-[16px] text-[#808191] bg-[#28282e] text-center px-3 py-2 w-full rounded-b-[10px]">
        {title}
      </p>
    </div>
  )
}

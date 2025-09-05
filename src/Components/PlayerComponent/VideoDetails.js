import React, { useState } from "react";
import { Link } from "react-router";

const VideoDescription = () => {
  const [showMore, setshowMore] = useState(false);
  return (
    <>
      <div className="title text-[#DDDDDD] bg-[#272727] overflow-hidden p-2 rounded-xl ml-20">
        <div className="flex ">
          <b>31M views 21 Oct </b>{" "}
          <span>
            {" "}
            <Link> #sohaib#this#best#BestAmzaing </Link>
          </span>{" "}
        </div>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere
        officiis quae quaerat animi ullam repudiandae ducimus eveniet assumenda
        minus amet, ratione eaque, vitae maiores alias ex nisi doloremque
        expedita ipsam!Lorem
        <br />
        <br />
        <p onClick={() => setshowMore(true)} className="cursor-pointer">
          ...more
        </p>
        {showMore && (
          <div>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate
            consequuntur, nisi neque vitae eum mollitia laudantium qui, nam
            harum maxime expedita aliquam quis necessitatibus eos reprehenderit
            blanditiis aperiam sed perspiciatis officiis consectetur fugiat.
            Minima reprehenderit, nostrum accusamus laborum cum quos excepturi,
            qui repellendus cumque voluptate alias voluptatibus. Voluptates, sed
            ipsa quos id sequi veritatis, culpa facilis libero quia, inventore
            earum corrupti deleniti distinctio repellat! Labore molestias vel
            debitis nisi reiciendis maiores laborum? Dignissimos fugit harum id
            excepturi? Placeat aperiam dicta perspiciatis illo natus
            consequuntur explicabo quos voluptatibus ipsam iure doloribus
            distinctio dolorum odit, suscipit necessitatibus inventore ad,
            repellendus neque. Voluptatum unde eum quaerat, cumque accusamus
            tempora possimus nesciunt impedit dicta! Quia error placeat aliquid,
            tempora dolore sunt consequuntur eius perspiciatis expedita maiores
            beatae. Deleniti beatae mollitia, maiores labore eos perspiciatis
            cupiditate nisi iste odit vel architecto in doloribus blanditiis
            obcaecati aut sequi ipsum nesciunt nobis? Commodi id voluptas
            voluptatem beatae autem ad sequi, eaque fugiat ducimus expedita,
            quod quia? Similique ex consequuntur magni earum omnis cum delectus
            officia rem iste repellat voluptates recusandae eligendi, nihil iure
            sequi. Maxime minus eligendi repellat, earum laborum fugiat modi
            dolorum accusamus debitis obcaecati atque corrupti quam quaerat
            possimus ab, ipsa mollitia, vitae culpa rerum.
            <p onClick={() => setshowMore(false)} className="cursor-pointer">
              <b>Show Less </b>
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default VideoDescription;

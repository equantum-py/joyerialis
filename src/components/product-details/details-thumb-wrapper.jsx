import Image from "next/image";
import { useState, useEffect } from "react";
import PopupVideo from "../common/popup-video";

const PRODUCT_PLACEHOLDER = '/assets/img/product/product-placeholder.svg';

const DetailsThumbWrapper = ({
  imageURLs,
  handleImageActive,
  activeImg,
  imgWidth = 416,
  imgHeight = 480,
  videoId = false,
  status
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const safeImages = Array.isArray(imageURLs) && imageURLs.length
    ? imageURLs
    : [{ img: activeImg || PRODUCT_PLACEHOLDER, url: activeImg || PRODUCT_PLACEHOLDER }];
  const safeActiveImg = activeImg || safeImages[0]?.img || PRODUCT_PLACEHOLDER;
  return (
    <>
      <div className="tp-product-details-thumb-wrapper tp-tab d-sm-flex">
        <nav>
          <div className="nav nav-tabs flex-sm-column">
            {safeImages.map((item, i) => (
              <button
                key={i}
                className={`nav-link ${(item.img || item.url) === safeActiveImg ? "active" : ""}`}
                onClick={() => handleImageActive({ ...item, img: item.img || item.url || PRODUCT_PLACEHOLDER })}
              >
                <Image
                  src={item.img || item.url || PRODUCT_PLACEHOLDER}
                  alt="image"
                  width={78}
                  height={100}
                  style={{ width: "100%", height: "100%" }}
                />
              </button>
            ))}
          </div>
        </nav>
        <div className="tab-content m-img">
          <div className="tab-pane fade show active">
            <div className="tp-product-details-nav-main-thumb p-relative">
              <Image
                src={safeActiveImg}
                alt="product img"
                width={imgWidth}
                height={imgHeight}
              />
              <div className="tp-product-badge">
                {status === 'out-of-stock' && <span className="product-hot">out-stock</span>}
              </div>
              {videoId && (
                <div
                  onClick={() => setIsVideoOpen(true)}
                  className="tp-product-details-thumb-video"
                >
                  <a className="tp-product-details-thumb-video-btn cursor-pointer popup-video">
                    <i className="fas fa-play"></i>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* modal popup start */}
      {videoId && (
        <PopupVideo
          isVideoOpen={isVideoOpen}
          setIsVideoOpen={setIsVideoOpen}
          videoId={videoId}
        />
      )}
      {/* modal popup end */}
    </>
  );
};

export default DetailsThumbWrapper;

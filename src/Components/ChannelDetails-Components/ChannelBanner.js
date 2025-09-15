const ChannelBanner = ({ bannerExternalUrl }) => {
  return (
    <div className="w-full h-[200px] banner-img overflow-hidden rounded-2xl shadow-md">
      <img
        src={bannerExternalUrl}
        alt="Channel Banner"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ChannelBanner

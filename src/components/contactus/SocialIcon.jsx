
const SocialIcon = ({ icon, url }) => (
  <a href={url} target="_blank" rel="noopener noreferrer">
    <div className="w-10 h-10 bg-[#FFFFFF]/15 rounded-[39px] flex items-center justify-center">
      <img src={icon} alt={url} className="w-5 h-5" />
    </div>
  </a>
);

export default SocialIcon;

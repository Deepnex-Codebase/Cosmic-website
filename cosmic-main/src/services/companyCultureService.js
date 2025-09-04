import axios from 'axios';

// Define API_URL using environment variable
const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com';

const api = axios.create({
  baseURL: `${API_URL}/cms/company-culture`,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 30000,
});

// Get company culture data
export const getCompanyCulture = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching company culture data:', error);
    throw error;
  }
};

// Update company culture data
export const updateCompanyCulture = async (data) => {
  try {
    // Make sure we're sending valid JSON data
    const cleanData = JSON.parse(JSON.stringify(data));
    
    // Try using fetch instead of axios for this specific call
    const response = await fetch(`${API_URL}/cms/company-culture`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status}`);
    }
    
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error updating company culture data:', error);
    throw error;
  }
};

// Upload image
export const uploadCompanyCultureImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    // Check file size before uploading
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 40) {
      throw new Error('File size exceeds 40MB limit. Please choose a smaller file.');
    }
    
    // Use fetch API instead of axios for more reliable multipart/form-data handling
    const response = await fetch(`${API_URL}/cms/company-culture/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Format the image URL before returning
    if (result && result.imageUrl) {
      result.imageUrl = formatImageUrl(result.imageUrl);
    }
    
    return result;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Format image URL to ensure it uses the production API URL
export const formatImageUrl = (url) => {
  if (!url) return url;
  
  // If the URL already contains the production API URL, return it as is
  if (url.includes('https://api.cosmicpowertech.com')) {
    return url;
  }
  
  // If the URL contains localhost, replace it with the production API URL
  if (url.includes('localhost')) {
    return url.replace(/http:\/\/localhost:[0-9]+/, 'https://api.cosmicpowertech.com');
  }
  
  // If the URL is a relative path (starts with /), prepend the production API URL
  if (url.startsWith('/')) {
    return `https://api.cosmicpowertech.com${url}`;
  }
  
  return url;
};

// Get Font Awesome icons
export const getFontAwesomeIcons = async () => {
  try {
    // List of commonly used Font Awesome icons
    // This is a subset of popular icons from Font Awesome 5/6
    const icons = {
      // Common icons
      common: [
        'FaUsers', 'FaUser', 'FaUserFriends', 'FaUserTie', 'FaUserShield',
        'FaProjectDiagram', 'FaTasks', 'FaClipboardList', 'FaListAlt', 'FaChartLine',
        'FaSolarPanel', 'FaSun', 'FaBolt', 'FaLightbulb', 'FaPlug',
        'FaAward', 'FaTrophy', 'FaMedal', 'FaStar', 'FaCertificate',
        'FaLeaf', 'FaSeedling', 'FaTree', 'FaRecycle', 'FaEnvira',
        'FaHandshake', 'FaHandsHelping', 'FaPeopleCarry', 'FaPersonBooth', 'FaHandHoldingHeart'
      ],
      
      // Arrows
      arrows: [
        'FaArrowUp', 'FaArrowDown', 'FaArrowLeft', 'FaArrowRight',
        'FaArrowCircleUp', 'FaArrowCircleDown', 'FaArrowCircleLeft', 'FaArrowCircleRight',
        'FaAngleUp', 'FaAngleDown', 'FaAngleLeft', 'FaAngleRight',
        'FaAngleDoubleUp', 'FaAngleDoubleDown', 'FaAngleDoubleLeft', 'FaAngleDoubleRight',
        'FaChevronUp', 'FaChevronDown', 'FaChevronLeft', 'FaChevronRight',
        'FaChevronCircleUp', 'FaChevronCircleDown', 'FaChevronCircleLeft', 'FaChevronCircleRight',
        'FaLongArrowAltUp', 'FaLongArrowAltDown', 'FaLongArrowAltLeft', 'FaLongArrowAltRight',
        'FaExchangeAlt', 'FaRandom', 'FaReply', 'FaShare'
      ],
      
      // Business
      business: [
        'FaGlobe', 'FaGlobeAmericas', 'FaGlobeAsia', 'FaGlobeEurope', 'FaGlobeAfrica',
        'FaIndustry', 'FaFactory', 'FaBuilding', 'FaCity', 'FaWarehouse',
        'FaHome', 'FaHouseUser', 'FaHospital', 'FaSchool', 'FaUniversity',
        'FaMoneyBill', 'FaCreditCard', 'FaWallet', 'FaDollarSign', 'FaCoins',
        'FaShoppingCart', 'FaStore', 'FaShoppingBag', 'FaTag', 'FaTags',
        'FaChartBar', 'FaChartPie', 'FaChartArea', 'FaPercentage', 'FaProjectDiagram',
        'FaNetworkWired', 'FaSitemap', 'FaCalendarAlt', 'FaBriefcase', 'FaHandshake'
      ],
      
      // Energy & Environment
      energy: [
        'FaSolarPanel', 'FaSun', 'FaBolt', 'FaLightbulb', 'FaPlug',
        'FaLeaf', 'FaSeedling', 'FaTree', 'FaRecycle', 'FaEnvira',
        'FaWater', 'FaWind', 'FaFire', 'FaCloudSun', 'FaCloudRain',
        'FaSnowflake', 'FaTemperatureHigh', 'FaTemperatureLow', 'FaFan', 'FaBatteryFull',
        'FaBatteryThreeQuarters', 'FaBatteryHalf', 'FaBatteryQuarter', 'FaBatteryEmpty', 'FaChargingStation',
        'FaGasPump', 'FaOilCan', 'FaIndustry', 'FaSmog', 'FaRadiation'
      ],
      
      // Interface
      interface: [
        'FaBars', 'FaTimes', 'FaPlus', 'FaMinus', 'FaCheck',
        'FaExclamation', 'FaQuestion', 'FaInfo', 'FaSearch', 'FaFilter',
        'FaCog', 'FaCogs', 'FaSliders', 'FaWrench', 'FaTools',
        'FaEllipsisH', 'FaEllipsisV', 'FaToggleOn', 'FaToggleOff', 'FaLock',
        'FaLockOpen', 'FaEye', 'FaEyeSlash', 'FaBell', 'FaBellSlash',
        'FaTrash', 'FaEdit', 'FaPen', 'FaPencilAlt', 'FaEraser',
        'FaSave', 'FaDownload', 'FaUpload', 'FaCloudDownloadAlt', 'FaCloudUploadAlt'
      ],
      
      // Transportation
      transportation: [
        'FaCar', 'FaTruck', 'FaShip', 'FaPlane', 'FaTrain',
        'FaBus', 'FaMotorcycle', 'FaBicycle', 'FaWalking', 'FaRunning',
        'FaShuttleVan', 'FaTaxi', 'FaTruckMoving', 'FaTruckLoading', 'FaAmbulance',
        'FaHelicopter', 'FaSpaceShuttle', 'FaSubway', 'FaTractor', 'FaCarSide',
        'FaCarAlt', 'FaTruckPickup', 'FaShippingFast', 'FaRoute', 'FaRoad'
      ],
      
      // Communication
      communication: [
        'FaPhone', 'FaEnvelope', 'FaMailBulk', 'FaComment', 'FaComments',
        'FaCommentDots', 'FaCommentAlt', 'FaPaperPlane', 'FaInbox', 'FaReply',
        'FaReplyAll', 'FaShare', 'FaShareAlt', 'FaRss', 'FaWifi',
        'FaMobile', 'FaMobileAlt', 'FaTablet', 'FaTabletAlt', 'FaLaptop',
        'FaDesktop', 'FaHeadphones', 'FaMicrophone', 'FaVideo', 'FaCamera',
        'FaBullhorn', 'FaVolumeUp', 'FaVolumeDown', 'FaVolumeMute', 'FaVoicemail'
      ],
      
      // Health & Wellness
      health: [
        'FaHeart', 'FaHeartbeat', 'FaMedkit', 'FaAmbulance', 'FaHospitalAlt',
        'FaStethoscope', 'FaNotesMedical', 'FaPrescriptionBottleAlt', 'FaPills', 'FaCapsules',
        'FaWeight', 'FaRunning', 'FaWalking', 'FaHiking', 'FaSwimmer',
        'FaBiking', 'FaDumbbell', 'FaHotTub', 'FaSpa', 'FaAppleAlt',
        'FaCarrot', 'FaPepperHot', 'FaWineGlass', 'FaCoffee', 'FaGlassWater'
      ],
      
      // Education & Knowledge
      education: [
        'FaBook', 'FaBookOpen', 'FaGraduationCap', 'FaUserGraduate', 'FaChalkboardTeacher',
        'FaSchool', 'FaUniversity', 'FaAtom', 'FaMicroscope', 'FaFlask',
        'FaVial', 'FaDna', 'FaBrain', 'FaLightbulb', 'FaQuestion',
        'FaQuestionCircle', 'FaInfo', 'FaInfoCircle', 'FaNewspaper', 'FaBookReader',
        'FaChalkboard', 'FaPencilAlt', 'FaCalculator', 'FaGlobe', 'FaLanguage'
      ],
      
      // Technology
      technology: [
        'FaCode', 'FaCodeBranch', 'FaBug', 'FaTerminal', 'FaLaptopCode',
        'FaDatabase', 'FaServer', 'FaNetworkWired', 'FaWifi', 'FaBluetooth',
        'FaMicrochip', 'FaMemory', 'FaHdd', 'FaSdCard', 'FaUsb',
        'FaKeyboard', 'FaMouse', 'FaDesktop', 'FaLaptop', 'FaMobile',
        'FaTablet', 'FaGamepad', 'FaHeadset', 'FaPrint', 'FaQrcode',
        'FaBarcode', 'FaRobot', 'FaSimCard', 'FaSatelliteDish', 'FaBroadcastTower'
      ]
    };
    
    // Create a flat array of all icons for backward compatibility
    const allIcons = Object.values(icons).flat();
    
    // Return both categorized and flat list
    return { categories: icons, all: allIcons };
  } catch (error) {
    console.error('Error fetching Font Awesome icons:', error);
    // Return a default set of icons in case of error
    return { 
      categories: { common: ['FaLeaf', 'FaSolarPanel', 'FaHandshake', 'FaLightbulb'] },
      all: ['FaLeaf', 'FaSolarPanel', 'FaHandshake', 'FaLightbulb']
    };
  }
};

export default {
  getCompanyCulture,
  updateCompanyCulture,
  uploadCompanyCultureImage,
  formatImageUrl,
  getFontAwesomeIcons
};
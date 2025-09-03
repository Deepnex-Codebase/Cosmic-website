const CompanyStats = require('../models/CompanyStats');

// Get all company stats
const getCompanyStats = async (req, res) => {
  try {
    const stats = await CompanyStats.find({ isActive: true }).sort({ order: 1 });
    
    // If no stats exist, create default ones
    if (stats.length === 0) {
      const defaultStats = [
        {
          value: 30,
          label: 'Years of Experience',
          icon: 'FaUsers',
          color: '#9fc22f',
          suffix: '+',
          animationDelay: 0,
          order: 1
        },
        {
          value: 10000,
          label: 'Successful Projects',
          icon: 'FaProjectDiagram',
          color: 'rgb(28 155 231)',
          suffix: '+',
          animationDelay: 0.2,
          order: 2
        },
        {
          value: 2,
          label: 'Modules Shipped',
          icon: 'FaSolarPanel',
          color: '#9fc22f',
          suffix: 'M+',
          animationDelay: 0.4,
          order: 3
        },
        {
          value: 1.5,
          label: 'PV Modules Manufacturing Capacity',
          icon: 'FaBolt',
          color: 'rgb(28 155 231)',
          suffix: 'GW',
          description: '+2.5 GW Under Development',
          animationDelay: 0.6,
          order: 4
        }
      ];
      
      await CompanyStats.insertMany(defaultStats);
      return res.json(defaultStats);
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching company stats:', error);
    res.status(500).json({ message: 'Error fetching company stats', error: error.message });
  }
};

// Get single company stat
const getCompanyStatById = async (req, res) => {
  try {
    const stat = await CompanyStats.findById(req.params.id);
    if (!stat) {
      return res.status(404).json({ message: 'Company stat not found' });
    }
    res.json(stat);
  } catch (error) {
    console.error('Error fetching company stat:', error);
    res.status(500).json({ message: 'Error fetching company stat', error: error.message });
  }
};

// Create new company stat
const createCompanyStat = async (req, res) => {
  try {
    const {
      value,
      label,
      icon,
      customSvgIcon,
      color,
      suffix,
      description,
      animationDelay,
      order
    } = req.body;

    // Ensure only one of icon or customSvgIcon is provided
    const statData = {
      value,
      label,
      color,
      suffix,
      description,
      animationDelay,
      order
    };
    
    // Add either icon or customSvgIcon, not both
    if (customSvgIcon && customSvgIcon.trim() !== '') {
      statData.customSvgIcon = customSvgIcon;
      // If customSvgIcon is provided, don't set icon
    } else if (icon) {
      statData.icon = icon;
    }

    const newStat = new CompanyStats(statData);

    await newStat.save();
    res.status(201).json({ message: 'Company stat created successfully', stat: newStat });
  } catch (error) {
    console.error('Error creating company stat:', error);
    res.status(500).json({ message: 'Error creating company stat', error: error.message });
  }
};

// Update company stat
const updateCompanyStat = async (req, res) => {
  try {
    const {
      value,
      label,
      icon,
      customSvgIcon,
      color,
      suffix,
      description,
      animationDelay,
      order
    } = req.body;

    const stat = await CompanyStats.findById(req.params.id);
    if (!stat) {
      return res.status(404).json({ message: 'Company stat not found' });
    }

    // Update fields
    if (value !== undefined) stat.value = value;
    if (label !== undefined) stat.label = label;
    
    // Handle icon and customSvgIcon to ensure only one is set
    if (customSvgIcon !== undefined && customSvgIcon.trim() !== '') {
      stat.customSvgIcon = customSvgIcon;
      stat.icon = undefined; // Clear icon if customSvgIcon is provided
    } else if (icon !== undefined) {
      stat.icon = icon;
      stat.customSvgIcon = undefined; // Clear customSvgIcon if icon is provided
    }
    
    if (color !== undefined) stat.color = color;
    if (suffix !== undefined) stat.suffix = suffix;
    if (description !== undefined) stat.description = description;
    if (animationDelay !== undefined) stat.animationDelay = animationDelay;
    if (order !== undefined) stat.order = order;

    await stat.save();
    res.json({ message: 'Company stat updated successfully', stat });
  } catch (error) {
    console.error('Error updating company stat:', error);
    res.status(500).json({ message: 'Error updating company stat', error: error.message });
  }
};

// Delete company stat
const deleteCompanyStat = async (req, res) => {
  try {
    const stat = await CompanyStats.findById(req.params.id);
    if (!stat) {
      return res.status(404).json({ message: 'Company stat not found' });
    }

    await CompanyStats.findByIdAndDelete(req.params.id);
    res.json({ message: 'Company stat deleted successfully' });
  } catch (error) {
    console.error('Error deleting company stat:', error);
    res.status(500).json({ message: 'Error deleting company stat', error: error.message });
  }
};

// Reset to default stats
const resetCompanyStats = async (req, res) => {
  try {
    await CompanyStats.deleteMany({});
    
    const defaultStats = [
      {
        value: 30,
        label: 'Years of Experience',
        icon: 'FaUsers',
        color: '#9fc22f',
        suffix: '+',
        animationDelay: 0,
        order: 1
      },
      {
        value: 10000,
        label: 'Successful Projects',
        icon: 'FaProjectDiagram',
        color: 'rgb(28 155 231)',
        suffix: '+',
        animationDelay: 0.2,
        order: 2
      },
      {
        value: 2,
        label: 'Modules Shipped',
        icon: 'FaSolarPanel',
        color: '#9fc22f',
        suffix: 'M+',
        animationDelay: 0.4,
        order: 3
      },
      {
        value: 1.5,
        label: 'PV Modules Manufacturing Capacity',
        icon: 'FaBolt',
        color: 'rgb(28 155 231)',
        suffix: 'GW',
        description: '+2.5 GW Under Development',
        animationDelay: 0.6,
        order: 4
      }
    ];
    
    await CompanyStats.insertMany(defaultStats);
    res.json({ message: 'Company stats reset to default', stats: defaultStats });
  } catch (error) {
    console.error('Error resetting company stats:', error);
    res.status(500).json({ message: 'Error resetting company stats', error: error.message });
  }
};

// Get Font Awesome icons list
const getFontAwesomeIcons = async (req, res) => {
  try {
    // List of commonly used Font Awesome icons
    // This is a subset of popular icons from Font Awesome 5/6
    const icons = [
      // Solid icons
      'FaUsers', 'FaUser', 'FaUserFriends', 'FaUserTie', 'FaUserShield',
      'FaProjectDiagram', 'FaTasks', 'FaClipboardList', 'FaListAlt', 'FaChartLine',
      'FaSolarPanel', 'FaSun', 'FaBolt', 'FaLightbulb', 'FaPlug',
      'FaAward', 'FaTrophy', 'FaMedal', 'FaStar', 'FaCertificate',
      'FaGlobe', 'FaGlobeAmericas', 'FaGlobeAsia', 'FaGlobeEurope', 'FaGlobeAfrica',
      'FaLeaf', 'FaSeedling', 'FaTree', 'FaRecycle', 'FaEnvira',
      'FaIndustry', 'FaFactory', 'FaBuilding', 'FaCity', 'FaWarehouse',
      'FaHome', 'FaHouseUser', 'FaHospital', 'FaSchool', 'FaUniversity',
      'FaCar', 'FaTruck', 'FaShip', 'FaPlane', 'FaTrain',
      'FaPhone', 'FaEnvelope', 'FaMailBulk', 'FaComment', 'FaComments',
      'FaCalendar', 'FaClock', 'FaStopwatch', 'FaCalendarAlt', 'FaCalendarCheck',
      'FaMoneyBill', 'FaCreditCard', 'FaWallet', 'FaDollarSign', 'FaCoins',
      'FaShoppingCart', 'FaStore', 'FaShoppingBag', 'FaTag', 'FaTags',
      'FaHeart', 'FaHeartbeat', 'FaMedkit', 'FaAmbulance', 'FaHospitalAlt',
      'FaBook', 'FaBookOpen', 'FaGraduationCap', 'FaUserGraduate', 'FaChalkboardTeacher',
      'FaTools', 'FaWrench', 'FaScrewdriver', 'FaHammer', 'FaToolbox',
      'FaCode', 'FaCodeBranch', 'FaBug', 'FaTerminal', 'FaLaptopCode',
      'FaDatabase', 'FaServer', 'FaNetworkWired', 'FaSitemap', 'FaCloud',
      'FaLock', 'FaUnlock', 'FaShieldAlt', 'FaFingerprint', 'FaUserLock',
      'FaCheck', 'FaTimes', 'FaExclamation', 'FaQuestion', 'FaInfo',
      'FaSearch', 'FaFilter', 'FaSort', 'FaSortUp', 'FaSortDown',
      'FaEdit', 'FaPen', 'FaPencilAlt', 'FaEraser', 'FaTrash',
      'FaDownload', 'FaUpload', 'FaSync', 'FaRedo', 'FaUndo',
      'FaPlay', 'FaPause', 'FaStop', 'FaForward', 'FaBackward',
      'FaExpand', 'FaCompress', 'FaArrowsAlt', 'FaArrowUp', 'FaArrowDown',
      'FaArrowLeft', 'FaArrowRight', 'FaAngleUp', 'FaAngleDown', 'FaAngleLeft',
      'FaAngleRight', 'FaChevronUp', 'FaChevronDown', 'FaChevronLeft', 'FaChevronRight',
      'FaBars', 'FaEllipsisV', 'FaEllipsisH', 'FaList', 'FaListUl',
      'FaImage', 'FaCamera', 'FaVideo', 'FaMusic', 'FaFileImage',
      'FaFile', 'FaFileAlt', 'FaFileWord', 'FaFileExcel', 'FaFilePdf',
      'FaFileCode', 'FaFileArchive', 'FaFileAudio', 'FaFileVideo', 'FaFileCsv',
      'FaLink', 'FaUnlink', 'FaPaperclip', 'FaExternalLinkAlt', 'FaShareAlt',
      'FaPrint', 'FaCopy', 'FaPaste', 'FaCut', 'FaSave',
      'FaMapMarker', 'FaMapMarkerAlt', 'FaMap', 'FaMapPin', 'FaDirections',
      'FaFacebook', 'FaTwitter', 'FaInstagram', 'FaLinkedin', 'FaYoutube',
      'FaWhatsapp', 'FaTelegram', 'FaSkype', 'FaSlack', 'FaDiscord',
      'FaWindows', 'FaApple', 'FaAndroid', 'FaLinux', 'FaUbuntu',
      'FaChrome', 'FaFirefox', 'FaSafari', 'FaEdge', 'FaInternetExplorer',
      'FaRss', 'FaWifi', 'FaBluetooth', 'FaQrcode', 'FaBarcode',
      'FaCoffee', 'FaUtensils', 'FaPizzaSlice', 'FaBeer', 'FaCocktail',
      'FaBed', 'FaBath', 'FaCouch', 'FaChair', 'FaToilet',
      'FaCar', 'FaBicycle', 'FaMotorcycle', 'FaBus', 'FaTaxi',
      'FaPlane', 'FaHelicopter', 'FaShip', 'FaTrain', 'FaSubway',
      'FaSun', 'FaMoon', 'FaCloudSun', 'FaCloudMoon', 'FaCloudRain',
      'FaSnowflake', 'FaWind', 'FaUmbrella', 'FaThermometerHalf', 'FaWater',
      'FaFire', 'FaFireExtinguisher', 'FaSmog', 'FaRadiation', 'FaBiohazard',
      'FaVirus', 'FaViruses', 'FaBacteria', 'FaDisease', 'FaHeadSideCough',
      'FaHandsWash', 'FaHandSparkles', 'FaPumpSoap', 'FaSprayCan', 'FaHandHoldingMedical',
      'FaMask', 'FaHeadSideMask', 'FaLungsVirus', 'FaClinicMedical', 'FaHospitalUser',
      'FaStethoscope', 'FaUserMd', 'FaUserNurse', 'FaProcedures', 'FaXRay',
      'FaVial', 'FaVials', 'FaCapsules', 'FaPills', 'FaPrescriptionBottle',
      'FaFirstAid', 'FaBandAid', 'FaSyringe', 'FaThermometer', 'FaLungs',
      'FaBrain', 'FaHeartBroken', 'FaWeight', 'FaWeightHanging', 'FaRunning',
      'FaWalking', 'FaSwimming', 'FaBiking', 'FaHiking', 'FaSkiing',
      'FaSkatingSkating', 'FaHockeyPuck', 'FaTableTennis', 'FaVolleyballBall', 'FaFootballBall',
      'FaBasketballBall', 'FaBaseballBall', 'FaGolfBall', 'FaChess', 'FaChessKing',
      'FaDice', 'FaGamepad', 'FaPuzzlePiece', 'FaChessBoard', 'FaPlaystation',
      'FaXbox', 'FaSteam', 'FaTwitch', 'FaHeadset', 'FaVrCardboard',
      'FaGlasses', 'FaSunglasses', 'FaEye', 'FaEyeSlash', 'FaEyeDropper',
      'FaEarListen', 'FaHandPointUp', 'FaHandPointDown', 'FaHandPointLeft', 'FaHandPointRight',
      'FaHandPaper', 'FaHandRock', 'FaHandScissors', 'FaHandLizard', 'FaHandSpock',
      'FaThumbsUp', 'FaThumbsDown', 'FaHandshake', 'FaPray', 'FaFistRaised',
      'FaBaby', 'FaChild', 'FaFemale', 'FaMale', 'FaTransgender',
      'FaVenus', 'FaMars', 'FaGenderless', 'FaNeuter', 'FaVenusMars',
      'FaWheelchair', 'FaBlind', 'FaDeaf', 'FaSignLanguage', 'FaLowVision',
      'FaBirthdayCake', 'FaCake', 'FaGift', 'FaGifts', 'FaCandle',
      'FaFireworks', 'FaPartyHorn', 'FaPartyPopper', 'FaConfetti', 'FaBalloon',
      'FaFlag', 'FaFlagUsa', 'FaFlagCheckered', 'FaGlobeAmericas', 'FaPassport',
      'FaIdCard', 'FaIdBadge', 'FaAddressCard', 'FaAddressBook', 'FaContactCard',
      'FaCamera', 'FaCameraRetro', 'FaVideo', 'FaVideoSlash', 'FaMicrophone',
      'FaMicrophoneSlash', 'FaHeadphones', 'FaVolumeUp', 'FaVolumeDown', 'FaVolumeMute',
      'FaDesktop', 'FaLaptop', 'FaTablet', 'FaMobile', 'FaMobileAlt',
      'FaKeyboard', 'FaMouse', 'FaPowerOff', 'FaBatteryFull', 'FaBatteryEmpty',
      'FaLightbulb', 'FaRegLightbulb', 'FaToggleOn', 'FaToggleOff', 'FaSliders',
      'FaCog', 'FaCogs', 'FaWrench', 'FaScrewdriver', 'FaTools',
      'FaHammer', 'FaToolbox', 'FaRuler', 'FaRulerCombined', 'FaCompass',
      'FaPencil', 'FaPen', 'FaPaintBrush', 'FaPalette', 'FaFillDrip',
      'FaEraser', 'FaEyeDropper', 'FaSprayCan', 'FaStamp', 'FaSwatchbook',
      'FaScissors', 'FaCut', 'FaPaste', 'FaCopy', 'FaClone',
      'FaTrash', 'FaTrashAlt', 'FaTrashRestore', 'FaRecycle', 'FaDumpster',
      'FaBoxOpen', 'FaBox', 'FaBoxes', 'FaArchive', 'FaWarehouse',
      'FaTruck', 'FaTruckLoading', 'FaTruckMoving', 'FaShippingFast', 'FaDolly',
      'FaConveyorBelt', 'FaPallet', 'FaStore', 'FaStoreAlt', 'FaShoppingCart',
      'FaShoppingBag', 'FaShoppingBasket', 'FaCashRegister', 'FaReceipt', 'FaCreditCard',
      'FaMoneyBill', 'FaMoneyBillWave', 'FaMoneyCheck', 'FaWallet', 'FaCoin',
      'FaDollarSign', 'FaEuroSign', 'FaPoundSign', 'FaYenSign', 'FaRupeeSign',
      'FaBitcoin', 'FaEthereum', 'FaCreditCard', 'FaPaypal', 'FaApplePay',
      'FaGooglePay', 'FaAmazonPay', 'FaCcVisa', 'FaCcMastercard', 'FaCcAmex',
      'FaChartBar', 'FaChartLine', 'FaChartPie', 'FaChartArea', 'FaAnalytics',
      'FaPercentage', 'FaProjectDiagram', 'FaNetworkWired', 'FaSitemap', 'FaShareAlt',
      'FaShareAltSquare', 'FaReply', 'FaReplyAll', 'FaForward', 'FaRandom',
      'FaSort', 'FaSortUp', 'FaSortDown', 'FaSortAlphaUp', 'FaSortAlphaDown',
      'FaSortNumericUp', 'FaSortNumericDown', 'FaSortAmountUp', 'FaSortAmountDown', 'FaFilter',
      'FaSearch', 'FaSearchPlus', 'FaSearchMinus', 'FaSearchLocation', 'FaSearchDollar',
      'FaCompress', 'FaCompressAlt', 'FaExpand', 'FaExpandAlt', 'FaCompress',
      'FaCompressArrowsAlt', 'FaExpandArrowsAlt', 'FaArrowsAlt', 'FaArrowsAltH', 'FaArrowsAltV',
      'FaLongArrowAltUp', 'FaLongArrowAltDown', 'FaLongArrowAltLeft', 'FaLongArrowAltRight', 'FaExchangeAlt',
      'FaRedo', 'FaRedoAlt', 'FaUndo', 'FaUndoAlt', 'FaSync',
      'FaSyncAlt', 'FaHistory', 'FaClockRotateLeft', 'FaClockRotateRight', 'FaRotate',
      'FaRotateLeft', 'FaRotateRight', 'FaRandom', 'FaShuffle', 'FaExchange',
      'FaPlay', 'FaPause', 'FaStop', 'FaStepForward', 'FaStepBackward',
      'FaFastForward', 'FaFastBackward', 'FaBackward', 'FaForward', 'FaEject',
      'FaVolumeMute', 'FaVolumeOff', 'FaVolumeDown', 'FaVolumeUp', 'FaMusic',
      'FaFilm', 'FaVideo', 'FaVideoSlash', 'FaClosedCaptioning', 'FaClosedCaptioning',
      'FaPhotoVideo', 'FaCamera', 'FaCameraRetro', 'FaImage', 'FaImages',
      'FaFileImage', 'FaFileVideo', 'FaFileAudio', 'FaFilm', 'FaPhotoFilm',
      'FaCirclePlay', 'FaCirclePause', 'FaCircleStop', 'FaPlayCircle', 'FaPauseCircle',
      'FaStopCircle', 'FaYoutube', 'FaVimeo', 'FaTwitch', 'FaSpotify',
      'FaSoundcloud', 'FaApple', 'FaItunes', 'FaAmazon', 'FaNetflix',
      'FaHulu', 'FaDisney', 'FaImdb', 'FaRotten', 'FaFilm',
      'FaTheaterMasks', 'FaTicket', 'FaTicketAlt', 'FaCouch', 'FaChair',
      'FaUserSecret', 'FaUserNinja', 'FaUserAstronaut', 'FaUserDoctor', 'FaUserNurse',
      'FaUserGraduate', 'FaUserTie', 'FaUserShield', 'FaUserCog', 'FaUserGear',
      'FaUserClock', 'FaUserCheck', 'FaUserXmark', 'FaUserSlash', 'FaUserLock',
      'FaUserPen', 'FaUserTag', 'FaUserMinus', 'FaUserPlus', 'FaUserGroup',
      'FaUsers', 'FaUserFriends', 'FaPeopleGroup', 'FaPeopleArrows', 'FaPeopleCarry',
      'FaPeoplePulling', 'FaPeopleLine', 'FaPersonWalking', 'FaPersonRunning', 'FaPersonBiking',
      'FaPersonSkiing', 'FaPersonSwimming', 'FaPersonHiking', 'FaPersonDigging', 'FaPersonShelter',
      'FaPersonCircleCheck', 'FaPersonCircleExclamation', 'FaPersonCirclePlus', 'FaPersonCircleQuestion', 'FaPersonCircleXmark',
      'FaPersonBurst', 'FaPersonDress', 'FaPersonDressBurst', 'FaPersonFalling', 'FaPersonFallingBurst',
      'FaPersonHalfDress', 'FaPersonHarassing', 'FaPersonMilitaryPointing', 'FaPersonMilitaryRifle', 'FaPersonMilitaryToPerson',
      'FaPersonPraying', 'FaPersonPregnant', 'FaPersonRays', 'FaPersonRifle', 'FaPersonShelter',
      'FaPersonSkating', 'FaPersonSkiing', 'FaPersonSkiingNordic', 'FaPersonSnowboarding', 'FaPersonSwimming',
      'FaPersonThroughWindow', 'FaPersonWalking', 'FaPersonWalkingArrowLoopLeft', 'FaPersonWalkingArrowRight', 'FaPersonWalkingDashedLineArrowRight',
      'FaPersonWalkingLuggage', 'FaPersonWalkingWithCane', 'FaRestroom', 'FaToilet', 'FaToiletPaper',
      'FaShower', 'FaBath', 'FaSink', 'FaHandsSoap', 'FaHandsWash',
      'FaHandSparkles', 'FaHandHoldingDroplet', 'FaHandHoldingHeart', 'FaHandHoldingMedical', 'FaHandHoldingDollar',
      'FaHandHoldingHand', 'FaHandsHolding', 'FaHandsHoldingChild', 'FaHandsHoldingCircle', 'FaHandshake',
      'FaHandshakeAngle', 'FaHandshakeSimple', 'FaHandshakeSimpleSlash', 'FaHandshakeSlash', 'FaHands',
      'FaHandsAslInterpreting', 'FaHandsBound', 'FaHandsBubbles', 'FaHandsClapping', 'FaHandsHolding',
      'FaHandsPraying', 'FaHand', 'FaHandBackFist', 'FaHandDots', 'FaHandFist',
      'FaHandHolding', 'FaHandHoldingBox', 'FaHandHoldingDollar', 'FaHandHoldingDroplet', 'FaHandHoldingHand',
      'FaHandHoldingHeart', 'FaHandHoldingMagic', 'FaHandHoldingMedical', 'FaHandLizard', 'FaHandMiddleFinger',
      'FaHandPaper', 'FaHandPeace', 'FaHandPointDown', 'FaHandPointLeft', 'FaHandPointRight',
      'FaHandPointUp', 'FaHandPointer', 'FaHandRock', 'FaHandScissors', 'FaHandSparkles',
      'FaHandSpock', 'FaThumbsDown', 'FaThumbsUp', 'FaHeart', 'FaHeartCircleBolt',
      'FaHeartCircleCheck', 'FaHeartCircleExclamation', 'FaHeartCircleMinus', 'FaHeartCirclePlus', 'FaHeartCircleXmark',
      'FaHeartCrack', 'FaHeartPulse', 'FaHeartbeat', 'FaKissWinkHeart', 'FaKiss',
      'FaKissBeam', 'FaFaceAngry', 'FaFaceDizzy', 'FaFaceFlushed', 'FaFaceFrown',
      'FaFaceFrownOpen', 'FaFaceGrimace', 'FaFaceGrin', 'FaFaceGrinBeam', 'FaFaceGrinBeamSweat',
      'FaFaceGrinHearts', 'FaFaceGrinSquint', 'FaFaceGrinSquintTears', 'FaFaceGrinStars', 'FaFaceGrinTears',
      'FaFaceGrinTongue', 'FaFaceGrinTongueSquint', 'FaFaceGrinTongueWink', 'FaFaceGrinWide', 'FaFaceGrinWink',
      'FaFaceKiss', 'FaFaceKissBeam', 'FaFaceKissWinkHeart', 'FaFaceLaugh', 'FaFaceLaughBeam',
      'FaFaceLaughSquint', 'FaFaceLaughWink', 'FaFaceMeh', 'FaFaceMehBlank', 'FaFaceRollingEyes',
      'FaFaceSadCry', 'FaFaceSadTear', 'FaFaceSmile', 'FaFaceSmileBeam', 'FaFaceSmileWink',
      'FaFaceSurprise', 'FaFaceTired', 'FaSmile', 'FaSmileBeam', 'FaSmileWink',
      'FaFrown', 'FaFrownOpen', 'FaMeh', 'FaMehBlank', 'FaMehRollingEyes',
      'FaSadCry', 'FaSadTear', 'FaGrin', 'FaGrinAlt', 'FaGrinBeam',
      'FaGrinBeamSweat', 'FaGrinHearts', 'FaGrinSquint', 'FaGrinSquintTears', 'FaGrinStars',
      'FaGrinTears', 'FaGrinTongue', 'FaGrinTongueSquint', 'FaGrinTongueWink', 'FaGrinWink',
      'FaLaugh', 'FaLaughBeam', 'FaLaughSquint', 'FaLaughWink', 'FaAngry',
      'FaDizzy', 'FaFlushed', 'FaFrown', 'FaFrownOpen', 'FaGrimace',
      'FaGrin', 'FaGrinBeam', 'FaGrinBeamSweat', 'FaGrinHearts', 'FaGrinSquint',
      'FaGrinSquintTears', 'FaGrinStars', 'FaGrinTears', 'FaGrinTongue', 'FaGrinTongueSquint',
      'FaGrinTongueWink', 'FaGrinWink', 'FaKiss', 'FaKissBeam', 'FaKissWinkHeart',
      'FaLaugh', 'FaLaughBeam', 'FaLaughSquint', 'FaLaughWink', 'FaMeh',
      'FaMehBlank', 'FaMehRollingEyes', 'FaSadCry', 'FaSadTear', 'FaSmile',
      'FaSmileBeam', 'FaSmileWink', 'FaSurprise', 'FaTired'
    ];

    res.json({ icons });
  } catch (error) {
    console.error('Error fetching Font Awesome icons:', error);
    res.status(500).json({ message: 'Error fetching Font Awesome icons', error: error.message });
  }
};

module.exports = {
  getCompanyStats,
  getCompanyStatById,
  createCompanyStat,
  updateCompanyStat,
  deleteCompanyStat,
  resetCompanyStats,
  getFontAwesomeIcons
};
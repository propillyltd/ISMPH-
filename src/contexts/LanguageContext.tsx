import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
];

export const TRANSLATIONS = {
  en: {
    // Common
    profile: 'Profile',
    settings: 'Settings',
    notifications: 'Notifications',
    language: 'Language',
    signOut: 'Sign Out',
    cancel: 'Cancel',
    save: 'Save',
    ok: 'OK',
    back: 'Back',

    // Settings
    general: 'General',
    about: 'About',
    accountSettings: 'Account Settings',
    accountSettingsDesc: 'Manage your account information and preferences',
    notificationsDesc: 'Configure notification preferences',
    languageDesc: 'Change app language',
    privacySecurity: 'Privacy & Security',
    privacySecurityDesc: 'Manage privacy settings and security options',
    helpSupport: 'Help & Support',
    helpSupportDesc: 'Get help and contact support',

    // Profile
    preferences: 'Preferences',
    changeProfilePicture: 'Change Profile Picture',
    takePhoto: 'Take Photo',
    chooseFromGallery: 'Choose from Gallery',
    selectLanguage: 'Select Language',

    // Auth
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account? Sign Up",
    alreadyHaveAccount: 'Already have an account? Sign In',
    resetPassword: 'Reset Password',
    sendResetEmail: 'Send Reset Email',

    // Home
    dashboard: 'Dashboard',
    welcome: 'Welcome',
    quickActions: 'Quick Actions',
    createReport: 'Create Report',
    createReportDesc: 'Submit new PHC report',
    uploadMedia: 'Upload Media',
    uploadMediaDesc: 'Add photos or videos',
    trendingNews: 'Trending News',
    trendingNewsDesc: 'Latest health updates',
    thematicAreaOfFocus: 'Thematic Area of Focus',
    exploreTopics: 'Explore health topics and policies',
    policyCommitments: 'Policy Commitments',
    recentReports: 'Recent Reports',
    viewAll: 'View All',

    // Reports
    phcStateReports: 'PHC State Reports',
    submitTrackReports: 'Submit and track facility reports',
    newReport: 'Submit New Report',
    reportDetails: 'Report Details',
    reportTitle: 'Report Title',
    category: 'Category',
    description: 'Description',
    detailedDescription: 'Detailed Description',
    priority: 'Priority',
    contactInformation: 'Contact Information',
    yourFullName: 'Your Full Name',
    phoneNumber: 'Phone Number',
    address: 'Address',
    mediaAttachments: 'Media Attachments',
    submitReport: 'Submit Report',
    total: 'Total',
    pending: 'Pending',
    approved: 'Approved',

    // News
    mediaReports: 'Media Reports',
    searchNews: 'Search news...',
    all: 'All',
    high: 'High',
    medium: 'Medium',
    low: 'Low',

    // Categories
    rmncah: 'RMNCAH',
    rmncahFull: 'Reproductive Maternal, Newborn, Child, and Adolescent Health',
    primaryHealthCare: 'Primary Health Care',
    contributoryHealthInsurance: 'Contributory Health Insurance',

    // Success/Error Messages
    profileUpdated: 'Profile Updated',
    languageUpdated: 'Language Updated',
    notificationsUpdated: 'Notifications Updated',
    reportSubmitted: 'Report Submitted',
    signedOut: 'Signed Out',
    successfullySignedIn: 'Successfully signed in',
    welcomeBack: 'Welcome Back',
    accountCreated: 'Account Created',
    welcomeToISMPH: 'Welcome to ISMPH Media Tracker',

    // Error Messages
    missingInformation: 'Missing Information',
    fillRequiredFields: 'Please fill in all required fields',
    contactInfoRequired: 'Contact Information Required',
    provideNameEmail: 'Please provide your name and email',
    invalidCredentials: 'Invalid email or password. Please check your credentials.',
    unconfirmedEmail: 'Please check your email and confirm your account before signing in.',
    duplicateUser: 'An account with this email already exists. Try signing in instead.',
    weakPassword: 'Password must be at least 6 characters long.',
    invalidEmail: 'Please enter a valid email address.',
    resetFailed: 'Failed to send reset email. Please try again.',
    noAccountFound: 'No account found with this email address.',
    tooManyRequests: 'Too many reset attempts. Please wait before trying again.',
    updateFailed: 'Update Failed',
    uploadFailed: 'Upload Failed',
    failedToUpload: 'Failed to upload profile picture. Please try again.',
    failedToUpdateNotifications: 'Failed to update notification settings',
    failedToUpdateLanguage: 'Failed to update language preference',
    error: 'Error',
    failedToSignOut: 'Failed to sign out',
  },
  ha: {
    // Common
    profile: 'Profile',
    settings: 'Saituna',
    notifications: 'Sanarwa',
    language: 'Harshe',
    signOut: 'Fita',
    cancel: 'Soke',
    save: 'Ajiye',
    ok: 'OK',
    back: 'Baya',

    // Settings
    general: 'Gabaɗaya',
    about: 'Game da',
    accountSettings: 'Saitunan Asusu',
    accountSettingsDesc: 'Sarrafa bayanan asusunka da zaɓuɓɓuka',
    notificationsDesc: 'Saita zaɓuɓɓukan sanarwa',
    languageDesc: 'Canza harshen app',
    privacySecurity: 'Sirri & Tsaro',
    privacySecurityDesc: 'Sarrafa saitunan sirri da zaɓuɓɓukan tsaro',
    helpSupport: 'Taimako & Tallafi',
    helpSupportDesc: 'Samu taimako da tuntuɓi tallafi',

    // Profile
    preferences: 'Zaɓuɓɓuka',
    changeProfilePicture: 'Canza Hoton Profile',
    takePhoto: 'Ɗauki Hoto',
    chooseFromGallery: 'Zaɓi daga Gallery',
    selectLanguage: 'Zaɓi Harshe',

    // Auth
    signIn: 'Shiga',
    signUp: 'Yi Rijista',
    email: 'Imel',
    password: 'Kalmar Sirri',
    fullName: 'Cikakken Suna',
    forgotPassword: 'Manta Kalmar Sirri?',
    dontHaveAccount: 'Ba ku da asusu? Yi Rijista',
    alreadyHaveAccount: 'Kuna da asusu? Shiga',
    resetPassword: 'Sake Saitawa Kalmar Sirri',
    sendResetEmail: 'Aika Imel na Sake Saitawa',

    // Home
    dashboard: 'Dashboard',
    welcome: 'Barka da zuwa',
    quickActions: 'Ayyuka na Gaggawa',
    createReport: 'Ƙirƙiri Rahoto',
    createReportDesc: 'Ƙaddamar da sabon rahoton PHC',
    uploadMedia: 'Loda Media',
    uploadMediaDesc: 'Ƙara hotuna ko bidiyo',
    trendingNews: 'Labaran Trending',
    trendingNewsDesc: 'Sabbin labaran kiwon lafiya',
    thematicAreaOfFocus: 'Yankin Thematic na Focus',
    exploreTopics: 'Bincika batutuwan kiwon lafiya da manufofi',
    policyCommitments: 'Alƙawuran Manufofi',
    recentReports: 'Rahotanni na Baya-bayan nan',
    viewAll: 'Duba Duka',

    // Reports
    phcStateReports: 'Rahotannin PHC na Jiha',
    submitTrackReports: 'Ƙaddamar da bin diddigin rahotannin wurin aiki',
    newReport: 'Ƙaddamar da Sabon Rahoto',
    reportDetails: 'Bayanin Rahoto',
    reportTitle: 'Take na Rahoto',
    category: 'Rukuni',
    description: 'Bayani',
    detailedDescription: 'Cikakken Bayani',
    priority: 'Muhimmanci',
    contactInformation: 'Bayanin Tuntuɓi',
    yourFullName: 'Cikakken Sunanku',
    phoneNumber: 'Lambar Wayar',
    address: 'Adireshi',
    mediaAttachments: 'Haɗin Media',
    submitReport: 'Ƙaddamar da Rahoto',
    total: 'Jimlar',
    pending: 'Ana Jira',
    approved: 'An Karɓa',

    // News
    mediaReports: 'Rahotannin Media',
    searchNews: 'Bincika labarai...',
    all: 'Duka',
    high: 'Babba',
    medium: 'Matsakaici',
    low: 'Ƙarami',

    // Categories
    rmncah: 'RMNCAH',
    rmncahFull: 'Kiwon Lafiya na Haihuwa, Iyaye, Jarirai, Yara, da Matasa',
    primaryHealthCare: 'Kiwon Lafiya na Farko',
    contributoryHealthInsurance: 'Inshorar Kiwon Lafiya na Gudummawa',

    // Success/Error Messages
    profileUpdated: 'An Sabunta Profile',
    languageUpdated: 'An Sabunta Harshe',
    notificationsUpdated: 'An Sabunta Sanarwa',
    reportSubmitted: 'An Ƙaddamar da Rahoto',
    signedOut: 'An Fita',
    successfullySignedIn: 'An shiga cikin nasara',
    welcomeBack: 'Barka da Komawa',
    accountCreated: 'An Ƙirƙiri Asusu',
    welcomeToISMPH: 'Barka da zuwa ISMPH Media Tracker',

    // Error Messages
    missingInformation: 'Bayanin da Ya Ƙara',
    fillRequiredFields: 'Da fatan cika duk filayen da ake buƙata',
    contactInfoRequired: 'Akwai Bukatar Bayanin Tuntuɓi',
    provideNameEmail: 'Da fatan bayar da sunanka da imel',
    invalidCredentials: 'Imel ko kalmar sirri ba daidai ba. Da fatan duba bayananka.',
    unconfirmedEmail: 'Da fatan duba imel ɗinku kuma tabbatar da asusunku kafin shiga.',
    duplicateUser: 'Akwai asusu tare da wannan imel. Gwada shiga maimakon.',
    weakPassword: 'Kalmar sirri dole ta kasance aƙalla haruffa 6.',
    invalidEmail: 'Da fatan shigar da imel mai inganci.',
    resetFailed: 'An kasa aika imel na sake saita. Da fatan gwada sake.',
    noAccountFound: 'Ba a sami asusu tare da wannan imel ba.',
    tooManyRequests: 'Yawan ƙoƙarin sake saita. Da fatan jira kafin sake gwada.',
    updateFailed: 'An Kasa Sabuntawa',
    uploadFailed: 'An Kasa Loda',
    failedToUpload: 'An kasa loda hoton profile. Da fatan gwada sake.',
    failedToUpdateNotifications: 'An kasa sabunta saitunan sanarwa',
    failedToUpdateLanguage: 'An kasa sabunta zaɓin harshe',
    error: 'Kuskure',
    failedToSignOut: 'An kasa fita',
  },
  yo: {
    // Common
    profile: 'Profaili',
    settings: 'Eto',
    notifications: 'Awọn iwifunni',
    language: 'Ede',
    signOut: 'Jade',
    cancel: 'Fagilee',
    save: 'Fi pamọ',
    ok: 'OK',
    back: 'Pada',

    // Settings
    general: 'Gbogbogbo',
    about: 'Nipa',
    accountSettings: 'Eto Akọọlẹ',
    accountSettingsDesc: 'Ṣakoso alaye akọọlẹ rẹ ati awọn ayanfẹ',
    notificationsDesc: 'Ṣatunkọ awọn ayanfẹ iwifunni',
    languageDesc: 'Yi ede app pada',
    privacySecurity: 'Ikọkọ & Aabo',
    privacySecurityDesc: 'Ṣakoso eto ikọkọ ati awọn aṣayan aabo',
    helpSupport: 'Iranlọwọ & Atilẹyin',
    helpSupportDesc: 'Gba iranlọwọ ati kan si atilẹyin',

    // Profile
    preferences: 'Awọn ayanfẹ',
    changeProfilePicture: 'Yi Aworan Profaili Pada',
    takePhoto: 'Ya Aworan',
    chooseFromGallery: 'Yan lati Gallery',
    selectLanguage: 'Yan Ede',

    // Auth
    signIn: 'Wọle',
    signUp: 'Forukọsilẹ',
    email: 'Imeeli',
    password: 'Ọrọigbaniwọle',
    fullName: 'Orukọ Kikun',
    forgotPassword: 'Gbagbe Ọrọigbaniwọle?',
    dontHaveAccount: 'Ko ni akọọlẹ? Forukọsilẹ',
    alreadyHaveAccount: 'Ni akọọlẹ tẹlẹ? Wọle',
    resetPassword: 'Tun Ọrọigbaniwọle Pada',
    sendResetEmail: 'Firanṣẹ Imeeli Atunṣe',

    // Home
    dashboard: 'Dasibodu',
    welcome: 'Kaabo',
    quickActions: 'Awọn iṣe ni kiakia',
    createReport: 'Ṣẹda Iroyin',
    createReportDesc: 'Fi iroyin PHC tuntun silẹ',
    uploadMedia: 'Gbejade Media',
    uploadMediaDesc: 'Fi awọn fọto tabi fidio kun',
    trendingNews: 'Awọn iroyin Trending',
    trendingNewsDesc: 'Awọn imudojuiwọn ilera tuntun',
    thematicAreaOfFocus: 'Agbegbe Thematic ti Idojukọ',
    exploreTopics: 'Ṣawari awọn koko-ọrọ ilera ati awọn eto imulo',
    policyCommitments: 'Awọn ifaramo Eto imulo',
    recentReports: 'Awọn iroyin aipẹ',
    viewAll: 'Wo Gbogbo',

    // Reports
    phcStateReports: 'Awọn iroyin PHC ti Ipinle',
    submitTrackReports: 'Fi silẹ ki o tọpinpin awọn iroyin ile-iṣẹ',
    newReport: 'Fi Iroyin Tuntun Silẹ',
    reportDetails: 'Awọn alaye Iroyin',
    reportTitle: 'Akọle Iroyin',
    category: 'Ẹka',
    description: 'Apejuwe',
    detailedDescription: 'Apejuwe Alaye',
    priority: 'Pataki',
    contactInformation: 'Alaye Olubasọrọ',
    yourFullName: 'Orukọ Kikun Rẹ',
    phoneNumber: 'Nọmba Foonu',
    address: 'Adirẹsi',
    mediaAttachments: 'Awọn asomọ Media',
    submitReport: 'Fi Iroyin Silẹ',
    total: 'Lapapọ',
    pending: 'Ni isunmọtosi',
    approved: 'Ti fọwọsi',

    // News
    mediaReports: 'Awọn iroyin Media',
    searchNews: 'Wa awọn iroyin...',
    all: 'Gbogbo',
    high: 'Ga',
    medium: 'Arin',
    low: 'Kekere',

    // Categories
    rmncah: 'RMNCAH',
    rmncahFull: 'Ilera Awọn obinrin Oyoyo, Awọn ọmọ tuntun, Awọn ọmọde, ati Awọn ọdọ',
    primaryHealthCare: 'Ilera Akọkọ',
    contributoryHealthInsurance: 'Iṣeduro Ilera ti Oluranlọwọ',

    // Success/Error Messages
    profileUpdated: 'Profaili Ti Mu Dara si',
    languageUpdated: 'Ede Ti Mu Dara si',
    notificationsUpdated: 'Awọn iwifunni Ti Mu Dara si',
    reportSubmitted: 'Iroyin Ti Fi Silẹ',
    signedOut: 'Ti Jade',
    successfullySignedIn: 'Ti wọle ni ifẹ',
    welcomeBack: 'Kaabo Pada',
    accountCreated: 'Akọọlẹ Ti Ṣẹda',
    welcomeToISMPH: 'Kaabo si ISMPH Media Tracker',

    // Error Messages
    missingInformation: 'Alaye ti o padanu',
    fillRequiredFields: 'Jọwọ fọwọsi gbogbo awọn aaye ti a beere',
    contactInfoRequired: 'Alaye Olubasọrọ ti a beere',
    provideNameEmail: 'Jọwọ pese orukọ rẹ ati imeeli',
    invalidCredentials: 'Imeeli tabi ọrọigbaniwọle ti ko tọ. Jọwọ ṣayẹwo alaye rẹ.',
    unconfirmedEmail: 'Jọwọ ṣayẹwo imeeli rẹ ki o si jẹrisi akọọlẹ rẹ ṣaaju ki o to wọle.',
    duplicateUser: 'Akọọlẹ kan wa pẹlu imeeli yii. Gbiyanju lati wọle dipo.',
    weakPassword: 'Ọrọigbaniwọle gbọdọ jẹ o kere ju awọn lẹta 6.',
    invalidEmail: 'Jọwọ tẹ imeeli ti o wulo.',
    resetFailed: 'Ti kuna lati fi imeeli atunṣe ranṣẹ. Jọwọ gbiyanju lẹẹkansi.',
    noAccountFound: 'Ko si akọọlẹ ti a ri pẹlu imeeli yii.',
    tooManyRequests: 'Awọn igbiyanju atunṣe pupọ ju. Jọwọ duro ṣaaju ki o to gbiyanju lẹẹkansi.',
    updateFailed: 'Imudojuiwọn Ti kuna',
    uploadFailed: 'Gbigbejade Ti kuna',
    failedToUpload: 'Ti kuna lati gbejade aworan profaili. Jọwọ gbiyanju lẹẹkansi.',
    failedToUpdateNotifications: 'Ti kuna lati mu awọn eto iwifunni dara si',
    failedToUpdateLanguage: 'Ti kuna lati mu ayanfẹ ede dara si',
    error: 'Asise',
    failedToSignOut: 'Ti kuna lati jade',
  },
  ig: {
    // Common
    profile: 'Profaịlụ',
    settings: 'Ntọala',
    notifications: 'Ngosi',
    language: 'Asụsụ',
    signOut: 'Pụọ',
    cancel: 'Kagbuo',
    save: 'Chekwa',
    ok: 'OK',
    back: 'Laghachi',

    // Settings
    general: 'Izugbe',
    about: 'Banyere',
    accountSettings: 'Ntọala Akaụntụ',
    accountSettingsDesc: 'Jikwaa ozi akaụntụ gị na mmasị',
    notificationsDesc: 'Hazie mmasị ngosi',
    languageDesc: 'Gbanwee asụsụ ngwa',
    privacySecurity: 'Nzuzo & Nchedo',
    privacySecurityDesc: 'Jikwaa ntọala nzuzo na nhọrọ nchedo',
    helpSupport: 'Enyemaka & Nkwado',
    helpSupportDesc: 'Nweta enyemaka na kpọtụrụ nkwado',

    // Profile
    preferences: 'Mmasị',
    changeProfilePicture: 'Gbanwee Foto Profaili',
    takePhoto: 'See Foto',
    chooseFromGallery: 'Họrọ site na Gallery',
    selectLanguage: 'Họrọ Asụsụ',

    // Auth
    signIn: 'Banye',
    signUp: 'Debanye aha',
    email: 'Email',
    password: 'Okwuntughe',
    fullName: 'Aha Ọfụma',
    forgotPassword: 'Chefuru Okwuntughe?',
    dontHaveAccount: 'Enweghị akaụntụ? Debanye aha',
    alreadyHaveAccount: 'Nwere akaụntụ? Banye',
    resetPassword: 'Tugharịa Okwuntughe',
    sendResetEmail: 'Zipu Email Mweghachi',

    // Home
    dashboard: 'Dashboard',
    welcome: 'Nnọọ',
    quickActions: 'Omume ngwa ngwa',
    createReport: 'Mepụta Akụkọ',
    createReportDesc: 'Nyefee akụkọ PHC ọhụrụ',
    uploadMedia: 'Bulite Media',
    uploadMediaDesc: 'Tinye foto ma ọ bụ vidiyo',
    trendingNews: 'Akụkọ Trending',
    trendingNewsDesc: 'Mmelite ahụike ọhụrụ',
    thematicAreaOfFocus: 'Mpaghara Thematic nke Focus',
    exploreTopics: 'Nyochaa isiokwu ahụike na amụma',
    policyCommitments: 'Nkwa Amụma',
    recentReports: 'Akụkọ nso nso a',
    viewAll: 'Lee Ha Niile',

    // Reports
    phcStateReports: 'Akụkọ PHC nke Steeti',
    submitTrackReports: 'Nyefee ma soro akụkọ ụlọ ọrụ',
    newReport: 'Nyefee Akụkọ Ọhụrụ',
    reportDetails: 'Nkọwa Akụkọ',
    reportTitle: 'Aha Akụkọ',
    category: 'Otu',
    description: 'Nkọwa',
    detailedDescription: 'Nkọwa zuru ezu',
    priority: 'Ihe dị mkpa',
    contactInformation: 'Ozi Kpọtụrụ',
    yourFullName: 'Aha Ọfụma Gị',
    phoneNumber: 'Nọmba Ekwentị',
    address: 'Adreesị',
    mediaAttachments: 'Mgbakwunye Media',
    submitReport: 'Nyefee Akụkọ',
    total: 'Mkpokọta',
    pending: 'Na-echere',
    approved: 'Kwere',

    // News
    mediaReports: 'Akụkọ Media',
    searchNews: 'Chọọ akụkọ...',
    all: 'Ha niile',
    high: 'Elu',
    medium: 'Etiti',
    low: 'Ala',

    // Categories
    rmncah: 'RMNCAH',
    rmncahFull: 'Ahụike Ụmụ nwanyị, Ụmụ ọhụrụ, Ụmụaka, na Ndị ntorobịa',
    primaryHealthCare: 'Ahụike Mbụ',
    contributoryHealthInsurance: 'Inshọransị Ahụike nke Ndị na-enye onyinye',

    // Success/Error Messages
    profileUpdated: 'Emelitere Profaili',
    languageUpdated: 'Emelitere Asụsụ',
    notificationsUpdated: 'Emelitere Ngosi',
    reportSubmitted: 'Enyefere Akụkọ',
    signedOut: 'Apụọla',
    successfullySignedIn: 'Banyere nke ọma',
    welcomeBack: 'Nnọọ Ọzọ',
    accountCreated: 'E kere Akaụntụ',
    welcomeToISMPH: 'Nnọọ na ISMPH Media Tracker',

    // Error Messages
    missingInformation: 'Ozi na-efu',
    fillRequiredFields: 'Biko mejupụta ubi niile achọrọ',
    contactInfoRequired: 'Achọrọ Ozi Kpọtụrụ',
    provideNameEmail: 'Biko nye aha gị na email',
    invalidCredentials: 'Email ma ọ bụ okwuntughe ezighi ezi. Biko lelee ozi gị.',
    unconfirmedEmail: 'Biko lelee email gị ma kwado akaụntụ gị tupu ịbanye.',
    duplicateUser: 'E nwere akaụntụ nwere email a. Nwaa ịbanye kama.',
    weakPassword: 'Okwuntughe ga-adịkarị opekata mpe mkpụrụedemede 6.',
    invalidEmail: 'Biko tinye email ziri ezi.',
    resetFailed: 'Emeghị nke ọma izipu email mweghachi. Biko nwaa ọzọ.',
    noAccountFound: 'Ọ dịghị akaụntụ achọtara na email a.',
    tooManyRequests: 'Ọtụtụ mbọ mweghachi. Biko chere tupu ịnwaa ọzọ.',
    updateFailed: 'Emeliteghị',
    uploadFailed: 'Ebuliteghị',
    failedToUpload: 'Emeghị nke ọma ibulite foto profaili. Biko nwaa ọzọ.',
    failedToUpdateNotifications: 'Emeghị nke ọma imelite ntọala ngosi',
    failedToUpdateLanguage: 'Emeghị nke ọma imelite mmasị asụsụ',
    error: 'Njehie',
    failedToSignOut: 'Emeghị nke ọma ịpụ',
  },
};

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
  languages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentLanguage, setCurrentLanguage] = useState(user?.language_preference || 'en');

  useEffect(() => {
    if (user?.language_preference) {
      setCurrentLanguage(user.language_preference);
    }
  }, [user?.language_preference]);

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
  };

  const t = (key: string): string => {
    const translations = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    return translations[key] || key;
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t,
    languages: LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
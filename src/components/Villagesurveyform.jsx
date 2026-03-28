import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ClipboardCheck, CheckCircle } from 'lucide-react';
import styles from './Villagesurveyform.module.css';
import axios from 'axios';

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  en: {
    pageTitle: 'Village Survey',
    // Sections
    secLocation: 'Location',
    secIdentity: 'Identity & Contact',
    secHousehold: 'Household Profile',
    secConsumption: 'Monthly Consumption',
    secPreferences: 'Shopping Preferences',
    // Location
    state: 'State', district: 'District', mandal: 'Mandal', village: 'Village',
    selectState: 'Select State', selectDistrict: 'Select District',
    selectMandal: 'Select Mandal', selectVillage: 'Select Village',
    loadingText: 'Loading…',
    wardArea: 'Ward / Area Name *',
    wardPlaceholder: 'Enter ward or area name',
    // Identity
    doorNumber: 'House Door Number *',
    doorPlaceholder: 'e.g. 12-34',
    familyHead: 'Family Head Name *',
    familyHeadPlaceholder: 'Full name',
    mobileNumbers: 'Mobile Numbers',
    mobilePlaceholder: 'Mobile',
    addMobile: '+ Add',
    removeMobile: 'Remove',
    // Household
    familyMembers: 'Total Family Members *',
    familyMembersPlaceholder: 'e.g. 4',
    familyType: 'Family Type *',
    selectType: 'Select type',
    nuclear: 'Nuclear Family', joint: 'Joint Family',
    occupation: 'Occupation *',
    selectOccupation: 'Select occupation',
    farming: 'Farming', dailyWage: 'Daily wage worker',
    privateJob: 'Private job', govtJob: 'Government job',
    business: 'Business', other: 'Other',
    // Consumption
    consumptionHint: 'Specify quantity with unit — e.g. 10 kg, 2 L, 1 dozen',
    // Preferences
    grocerySource: 'Grocery Source *', selectSource: 'Select source',
    localKirana: 'Local Kirana shop', weeklyMarket: 'Weekly market',
    townSuper: 'Town supermarket', online: 'Online',
    monthlySpend: 'Monthly Spend (₹) *', selectRange: 'Select range',
    spend1: '₹2,000 – ₹3,000', spend2: '₹3,000 – ₹5,000', spend3: 'More than ₹5,000',
    exactAmount: 'Enter exact amount (₹)',
    purchaseFreq: 'Purchase Frequency *', selectFreq: 'Select frequency',
    daily: 'Daily', weekly: 'Weekly', monthly: 'Once a month',
    brandedPref: 'Prefer Branded Products? *', selectPref: 'Select preference',
    yes: 'Yes', no: 'No', sometimes: 'Sometimes',
    productType: 'Loose vs Packaged? *', selectPType: 'Select type',
    loose: 'Loose products', packaged: 'Packaged products',
    digitalSuper: 'Open to Digital Supermarket? *', selectOption: 'Select option',
    // Submit
    submitBtn: '📤  Submit Survey',
    submitting: 'Syncing Survey…',
    // Success
    successTitle: 'Survey Submitted!',
    successSub: 'Data has been synced successfully.',
    newSurvey: '+ Start New Survey',
    // Errors
    errVillage: 'Please select a Village',
    errFamilyHead: 'Family Head Name is required',
    errWardArea: 'Ward / Area Name is required',
    errDoorNumber: 'House Door Number is required',
    errMobileMin: 'At least one valid mobile number is required',
    errMobileInvalid: 'Mobile number must be 10 digits starting with 6-9',
    errFamilyMembers: 'Family Members count is required',
    errFamilyType: 'Family Type is required',
    errOccupation: 'Occupation is required',
    errGrocerySource: 'Grocery Source is required',
    errMonthlySpending: 'Monthly Spending range is required',
    errMonthlySpendingCustom: 'Please enter exact amount',
    errConsumption: 'Please fill in at least one item in Monthly Consumption',
    errPurchaseFreq: 'Purchase Frequency is required',
    errBrandedPref: 'Branded Preference is required',
    errProductType: 'Product Type is required',
    errDigitalSuper: 'Please select Digital Supermarket preference',
    errServer: 'Submission failed: ',
  },
  te: {
    pageTitle: 'గ్రామ సర్వే',
    secLocation: 'స్థానం',
    secIdentity: 'గుర్తింపు & సంప్రదింపు',
    secHousehold: 'కుటుంబ వివరాలు',
    secConsumption: 'నెలవారీ వినియోగం',
    secPreferences: 'షాపింగ్ ప్రాధాన్యతలు',
    state: 'రాష్ట్రం', district: 'జిల్లా', mandal: 'మండలం', village: 'గ్రామం',
    selectState: 'రాష్ట్రం ఎంచుకోండి', selectDistrict: 'జిల్లా ఎంచుకోండి',
    selectMandal: 'మండలం ఎంచుకోండి', selectVillage: 'గ్రామం ఎంచుకోండి',
    loadingText: 'లోడవుతోంది…',
    wardArea: 'వార్డు / ప్రాంతం పేరు *',
    wardPlaceholder: 'వార్డు లేదా ప్రాంతం పేరు నమోదు చేయండి',
    doorNumber: 'ఇంటి నంబర్ *',
    doorPlaceholder: 'ఉదా. 12-34',
    familyHead: 'కుటుంబ పెద్ద పేరు *',
    familyHeadPlaceholder: 'పూర్తి పేరు',
    mobileNumbers: 'మొబైల్ నంబర్లు',
    mobilePlaceholder: 'మొబైల్',
    addMobile: '+ జోడించు',
    removeMobile: 'తొలగించు',
    familyMembers: 'మొత్తం కుటుంబ సభ్యులు *',
    familyMembersPlaceholder: 'ఉదా. 4',
    familyType: 'కుటుంబ రకం *',
    selectType: 'రకం ఎంచుకోండి',
    nuclear: 'న్యూక్లియర్ కుటుంబం', joint: 'సంయుక్త కుటుంబం',
    occupation: 'వృత్తి *',
    selectOccupation: 'వృత్తి ఎంచుకోండి',
    farming: 'వ్యవసాయం', dailyWage: 'రోజువారీ వేతన కార్మికుడు',
    privateJob: 'ప్రైవేట్ ఉద్యోగం', govtJob: 'ప్రభుత్వ ఉద్యోగం',
    business: 'వ్యాపారం', other: 'ఇతర',
    consumptionHint: 'పరిమాణం మరియు యూనిట్ తో నమోదు చేయండి — ఉదా. 10 kg, 2 L, 1 డజన్',
    grocerySource: 'కిరాణా వనరు *', selectSource: 'వనరు ఎంచుకోండి',
    localKirana: 'స్థానిక కిరాణా దుకాణం', weeklyMarket: 'వారపు సంత',
    townSuper: 'పట్టణ సూపర్‌మార్కెట్', online: 'ఆన్‌లైన్',
    monthlySpend: 'నెలవారీ ఖర్చు (₹) *', selectRange: 'పరిధి ఎంచుకోండి',
    spend1: '₹2,000 – ₹3,000', spend2: '₹3,000 – ₹5,000', spend3: '₹5,000 కంటే ఎక్కువ',
    exactAmount: 'సరిగ్గా మొత్తం నమోదు చేయండి (₹)',
    purchaseFreq: 'కొనుగోలు పౌనఃపున్యం *', selectFreq: 'పౌనఃపున్యం ఎంచుకోండి',
    daily: 'రోజూ', weekly: 'వారానికి', monthly: 'నెలకు ఒకసారి',
    brandedPref: 'బ్రాండెడ్ ఉత్పత్తులు ఇష్టమా? *', selectPref: 'ప్రాధాన్యత ఎంచుకోండి',
    yes: 'అవును', no: 'కాదు', sometimes: 'కొన్నిసార్లు',
    productType: 'వదులుగా vs ప్యాక్ చేసినది? *', selectPType: 'రకం ఎంచుకోండి',
    loose: 'వదులు ఉత్పత్తులు', packaged: 'ప్యాక్ ఉత్పత్తులు',
    digitalSuper: 'డిజిటల్ సూపర్‌మార్కెట్‌కు సిద్ధంగా ఉన్నారా? *', selectOption: 'ఎంపిక చేయండి',
    submitBtn: '📤  సర్వే సమర్పించు',
    submitting: 'సమర్పిస్తోంది…',
    successTitle: 'సర్వే సమర్పించబడింది!',
    successSub: 'డేటా విజయవంతంగా సేవ్ అయింది.',
    newSurvey: '+ కొత్త సర్వే',
    errVillage: 'దయచేసి గ్రామం ఎంచుకోండి',
    errFamilyHead: 'కుటుంబ పెద్ద పేరు అవసరం',
    errWardArea: 'వార్డు / ప్రాంతం పేరు అవసరం',
    errDoorNumber: 'ఇంటి నంబర్ అవసరం',
    errMobileMin: 'కనీసం ఒక చెల్లుబాటు అయ్యే మొబైల్ నంబర్ అవసరం',
    errMobileInvalid: 'మొబైల్ నంబర్ 6-9 తో మొదలయ్యే 10 అంకెలు ఉండాలి',
    errFamilyMembers: 'కుటుంబ సభ్యుల సంఖ్య అవసరం',
    errFamilyType: 'కుటుంబ రకం అవసరం',
    errOccupation: 'వృత్తి అవసరం',
    errGrocerySource: 'కిరాణా వనరు అవసరం',
    errMonthlySpending: 'నెలవారీ ఖర్చు పరిధి అవసరం',
    errMonthlySpendingCustom: 'సరిగ్గా మొత్తం నమోదు చేయండి',
    errConsumption: 'దయచేసి నెలవారీ వినియోగంలో కనీసం ఒక వస్తువు నింపండి',
    errPurchaseFreq: 'కొనుగోలు పౌనఃపున్యం అవసరం',
    errBrandedPref: 'బ్రాండెడ్ ప్రాధాన్యత అవసరం',
    errProductType: 'ఉత్పత్తి రకం అవసరం',
    errDigitalSuper: 'డిజిటల్ సూపర్‌మార్కెట్ ప్రాధాన్యత ఎంచుకోండి',
    errServer: 'సమర్పణ విఫలమైంది: ',
  }
};

// ─── CONSUMPTION ITEMS ────────────────────────────────────────────────────────
const consumptionItems = [
  { key: 'rice',       label: { en: 'Rice',             te: 'బియ్యం' },       icon: '🌾', placeholder: { en: '10 kg',   te: '10 kg' } },
  { key: 'wheat',      label: { en: 'Wheat / Atta',     te: 'గోధుమ / ఆటా' },  icon: '🌿', placeholder: { en: '5 kg',    te: '5 kg' } },
  { key: 'toorDal',    label: { en: 'Toor Dal',         te: 'కంది పప్పు' },   icon: '🫘', placeholder: { en: '2 kg',    te: '2 kg' } },
  { key: 'moongDal',   label: { en: 'Moong Dal',        te: 'పెసర పప్పు' },   icon: '🫘', placeholder: { en: '1 kg',    te: '1 kg' } },
  { key: 'chanaDal',   label: { en: 'Chana Dal',        te: 'శనగ పప్పు' },    icon: '🫘', placeholder: { en: '1 kg',    te: '1 kg' } },
  { key: 'oil',        label: { en: 'Cooking Oil',      te: 'నూనె' },         icon: '🛢️', placeholder: { en: '2 L',     te: '2 L' } },
  { key: 'sugar',      label: { en: 'Sugar',            te: 'చక్కెర' },       icon: '🍬', placeholder: { en: '2 kg',    te: '2 kg' } },
  { key: 'salt',       label: { en: 'Salt',             te: 'ఉప్పు' },        icon: '🧂', placeholder: { en: '1 kg',    te: '1 kg' } },
  { key: 'tea',        label: { en: 'Tea Powder',       te: 'టీ పొడి' },      icon: '🍵', placeholder: { en: '250 g',   te: '250 g' } },
  { key: 'milk',       label: { en: 'Milk',             te: 'పాలు' },         icon: '🥛', placeholder: { en: '1 L/day', te: '1 L/రోజు' } },
  { key: 'eggs',       label: { en: 'Eggs',             te: 'గుడ్లు' },       icon: '🥚', placeholder: { en: '30 pcs',  te: '30 పీస్' } },
  { key: 'bathSoap',   label: { en: 'Bath Soap',        te: 'స్నాన సబ్బు' },  icon: '🧼', placeholder: { en: '4 pcs',   te: '4 పీస్' } },
  { key: 'shampoo',    label: { en: 'Shampoo',          te: 'షాంపూ' },        icon: '🧴', placeholder: { en: '400 ml',  te: '400 ml' } },
  { key: 'detergent',  label: { en: 'Detergent Powder', te: 'డిటర్జెంట్' },   icon: '🧺', placeholder: { en: '1 kg',    te: '1 kg' } },
  { key: 'dishWash',   label: { en: 'Dish Wash',        te: 'పాత్రల సబ్బు' }, icon: '🍽️', placeholder: { en: '500 ml',  te: '500 ml' } },
  { key: 'toothpaste', label: { en: 'Toothpaste',       te: 'టూత్‌పేస్ట్' },  icon: '🦷', placeholder: { en: '150 g',   te: '150 g' } },
];

// ─── PARSE CONSUMPTION ────────────────────────────────────────────────────────
function parseConsumptionInput(raw = '') {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const match = trimmed.match(/^(\d+(\.\d+)?)\s*([a-zA-Z/]*)$/);
  if (match) return { value: parseFloat(match[1]), unit: match[3] || '', originalInput: trimmed };
  return { value: 0, unit: '', originalInput: trimmed };
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function VillageSurveyForm() {
  const agentData = useSelector(state => state.auth?.user || {});

  const [lang, setLang] = useState('en');
  const t = T[lang];

  const [states,    setStates]    = useState([]);
  const [districts, setDistricts] = useState([]);
  const [mandals,   setMandals]   = useState([]);
  const [villages,  setVillages]  = useState([]);
  const [loading,   setLoading]   = useState({ state: false, dist: false, mandal: false, village: false });

  const [selection, setSelection] = useState({
    stateName: '', districtName: '', mandalName: '', villageName: '',
    stateId: '', districtId: '', mandalId: '', villageId: '',
  });

  const [mobileNumbers, setMobileNumbers] = useState(['']);
  const [form, setForm] = useState({
    wardArea: '', doorNumber: '', familyHead: '',
    familyMembers: '', familyType: '', occupation: '',
    grocerySource: '', monthlySpending: '', monthlySpendingCustom: '',
    purchaseFrequency: '', brandedPreference: '', productType: '',
    cheaperOption: '', orderMethod: '',
    consumption: {},
    otherProduct: '', surveyorNote: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted,  setIsSubmitted]  = useState(false);
  const [serverError,  setServerError]  = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleConsumptionChange = (key, value) => {
    setForm(prev => ({ ...prev, consumption: { ...prev.consumption, [key]: value } }));
    if (fieldErrors.consumption) setFieldErrors(prev => ({ ...prev, consumption: '' }));
  };

  // ── Load states ──────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(p => ({ ...p, state: true }));
    axios.get('/states')
      .then(res => setStates(res.data.data || res.data))
      .finally(() => setLoading(p => ({ ...p, state: false })));
  }, []);

  const onStateSelect = (e) => {
    const id   = e.target.value;
    const name = states.find(s => s._id === id)?.name;
    setSelection({ stateId: id, stateName: name, districtId: '', districtName: '', mandalId: '', mandalName: '', villageId: '', villageName: '' });
    setDistricts([]); setMandals([]); setVillages([]);
    if (fieldErrors.village) setFieldErrors(prev => ({ ...prev, village: '' }));
    if (!id) return;
    setLoading(p => ({ ...p, dist: true }));
    axios.get(`/districts/state/${id}`)
      .then(res => setDistricts(res.data.data || res.data))
      .finally(() => setLoading(p => ({ ...p, dist: false })));
  };

  const onDistrictSelect = (e) => {
    const id   = e.target.value;
    const name = districts.find(d => d._id === id)?.name;
    setSelection(prev => ({ ...prev, districtId: id, districtName: name, mandalId: '', mandalName: '', villageId: '', villageName: '' }));
    setMandals([]); setVillages([]);
    if (!id) return;
    setLoading(p => ({ ...p, mandal: true }));
    axios.get(`/mandals/${id}`)
      .then(res => setMandals(res.data.data || res.data))
      .finally(() => setLoading(p => ({ ...p, mandal: false })));
  };

  const onMandalSelect = (e) => {
    const id   = e.target.value;
    const name = mandals.find(m => m._id === id)?.name;
    setSelection(prev => ({ ...prev, mandalId: id, mandalName: name, villageId: '', villageName: '' }));
    setVillages([]);
    if (!id) return;
    setLoading(p => ({ ...p, village: true }));
    axios.get(`/Villages/${id}`)
      .then(res => setVillages(res.data.data || res.data))
      .finally(() => setLoading(p => ({ ...p, village: false })));
  };

  const onVillageSelect = (e) => {
    const raw   = e.target.value;
    const found = villages.find(v => (v._id || v) === raw);
    const id    = found?._id  || '';
    const name  = found?.name || raw;
    setSelection(prev => ({ ...prev, villageId: id, villageName: name }));
    if (fieldErrors.village) setFieldErrors(prev => ({ ...prev, village: '' }));
  };

  // ── VALIDATE (mirrors mobile validation exactly) ──────────────────────────
  const validate = () => {
    const errs = {};

    // Location
    if (!selection.villageName) errs.village = t.errVillage;

    // Identity
    if (!form.familyHead.trim())  errs.familyHead  = t.errFamilyHead;
    if (!form.wardArea.trim())    errs.wardArea     = t.errWardArea;
    if (!form.doorNumber.trim())  errs.doorNumber   = t.errDoorNumber;

    // Mobile — same rule as mobile app
    const validMobiles = mobileNumbers.filter(m => m.length > 0);
    if (validMobiles.length === 0) {
      errs.mobile = t.errMobileMin;
    } else {
      validMobiles.forEach((m, i) => {
        if (!/^[6-9]\d{9}$/.test(m)) errs[`mobile_${i}`] = t.errMobileInvalid;
      });
    }

    // Household
    if (!form.familyMembers) errs.familyMembers = t.errFamilyMembers;
    if (!form.familyType)    errs.familyType    = t.errFamilyType;
    if (!form.occupation)    errs.occupation    = t.errOccupation;

    // Consumption — at least one item
    const hasConsumption = Object.values(form.consumption).some(v => v && v.trim().length > 0);
    if (!hasConsumption) errs.consumption = t.errConsumption;

    // Preferences
    if (!form.grocerySource)    errs.grocerySource    = t.errGrocerySource;
    if (!form.monthlySpending)  errs.monthlySpending  = t.errMonthlySpending;
    if (form.monthlySpending === 'custom' && !form.monthlySpendingCustom)
      errs.monthlySpendingCustom = t.errMonthlySpendingCustom;
    if (!form.purchaseFrequency) errs.purchaseFrequency = t.errPurchaseFreq;
    if (!form.brandedPreference) errs.brandedPreference = t.errBrandedPref;
    if (!form.productType)       errs.productType       = t.errProductType;
    if (!form.cheaperOption)     errs.cheaperOption     = t.errDigitalSuper;

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) {
      // Scroll to first error
      const firstErr = document.querySelector('[data-error="true"]');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    const parsedConsumption = {};
    for (const item of consumptionItems) {
      const parsed = parseConsumptionInput(form.consumption[item.key]);
      if (parsed) parsedConsumption[item.key] = parsed;
    }

    const payload = {
      wardArea:          form.wardArea,
      doorNumber:        form.doorNumber,
      familyHead:        form.familyHead,
      familyMembers:     form.familyMembers,
      familyType:        form.familyType,
      occupation:        form.occupation,
      grocerySource:     form.grocerySource,
      monthlySpending:   form.monthlySpending === 'custom' ? form.monthlySpendingCustom : form.monthlySpending,
      purchaseFrequency: form.purchaseFrequency,
      brandedPreference: form.brandedPreference,
      productType:       form.productType,
      cheaperOption:     form.cheaperOption,
      orderMethod:       form.orderMethod,
      consumption:       parsedConsumption,
      mobile:            mobileNumbers.filter(m => m.length === 10),
      surveyorId:        agentData?.surveyorId || agentData?.SurveyorId || '',
      villageId:         selection.villageId,
      surveyDate:        new Date().toISOString().split('T')[0],
      stateName:         selection.stateName,
      districtName:      selection.districtName,
      MandalName:        selection.mandalName,
      VillageName:       selection.villageName,
    };

    try {
      await axios.post('/surveys/form', payload);
      setIsSubmitted(true);
    } catch (err) {
      setServerError(t.errServer + (err.response?.data?.error || 'Server error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setForm({ wardArea: '', doorNumber: '', familyHead: '', familyMembers: '', familyType: '', occupation: '', grocerySource: '', monthlySpending: '', monthlySpendingCustom: '', purchaseFrequency: '', brandedPreference: '', productType: '', cheaperOption: '', orderMethod: '', consumption: {}, otherProduct: '', surveyorNote: '' });
    setMobileNumbers(['']);
    setSelection({ stateName: '', districtName: '', mandalName: '', villageName: '', stateId: '', districtId: '', mandalId: '', villageId: '' });
    setFieldErrors({});
    setServerError('');
  };

  if (isSubmitted) return <SuccessCard t={t} onReset={resetForm} />;

  return (
    <div className={styles.page}>

      {/* ── TOP BAR ── */}
      <div className={styles.topbar}>
        <ClipboardCheck size={22} color="#2563eb" />
        <h1 className={styles.topbarTitle}>{t.pageTitle}</h1>

        {/* Language Toggle */}
        <div className={styles.langToggle}>
          <button
            type="button"
            className={`${styles.langBtn} ${lang === 'en' ? styles.langBtnActive : ''}`}
            onClick={() => setLang('en')}
          >EN</button>
          <button
            type="button"
            className={`${styles.langBtn} ${lang === 'te' ? styles.langBtnActive : ''}`}
            onClick={() => setLang('te')}
          >తె</button>
        </div>

        {(agentData?.surveyorId || agentData?.SurveyorId) && (
          <span className={styles.agentBadge}>
            ID: {agentData?.surveyorId || agentData?.SurveyorId}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>

        {/* ── LOCATION ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader} style={{ borderColor: '#2563eb' }}>
            <span className={styles.cardIcon}>📍</span>
            <h2 className={styles.cardTitle}>{t.secLocation}</h2>
          </div>
          <div className={styles.grid4}>

            <div className={styles.field}>
              <label className={styles.label}>
                {t.state} {loading.state && <span className={styles.loading}>{t.loadingText}</span>}
              </label>
              <select className={styles.select} value={selection.stateId} onChange={onStateSelect}>
                <option value="">{t.selectState}</option>
                {states.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                {t.district} {loading.dist && <span className={styles.loading}>{t.loadingText}</span>}
              </label>
              <select className={styles.select} value={selection.districtId} onChange={onDistrictSelect} disabled={!districts.length}>
                <option value="">{t.selectDistrict}</option>
                {districts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                {t.mandal} {loading.mandal && <span className={styles.loading}>{t.loadingText}</span>}
              </label>
              <select className={styles.select} value={selection.mandalId} onChange={onMandalSelect} disabled={!mandals.length}>
                <option value="">{t.selectMandal}</option>
                {mandals.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </div>

            <div className={styles.field} data-error={!!fieldErrors.village}>
              <label className={styles.label}>
                {t.village} {loading.village && <span className={styles.loading}>{t.loadingText}</span>}
              </label>
              <select
                className={`${styles.select} ${fieldErrors.village ? styles.inputError : ''}`}
                value={selection.villageId || selection.villageName}
                onChange={onVillageSelect}
                disabled={!villages.length}
              >
                <option value="">{t.selectVillage}</option>
                {villages.map((v, i) => {
                  const val   = v._id  || v;
                  const label = v.name || v;
                  return <option key={`${val}-${i}`} value={val}>{label}</option>;
                })}
              </select>
              {fieldErrors.village && <span className={styles.errorText}>{fieldErrors.village}</span>}
            </div>

          </div>

          {/* Ward Area */}
          <div className={styles.field} style={{ marginTop: 14 }} data-error={!!fieldErrors.wardArea}>
            <label className={styles.label}>{t.wardArea}</label>
            <input
              className={`${styles.input} ${fieldErrors.wardArea ? styles.inputError : ''}`}
              placeholder={t.wardPlaceholder}
              name="wardArea"
              value={form.wardArea}
              onChange={handleChange}
            />
            {fieldErrors.wardArea && <span className={styles.errorText}>{fieldErrors.wardArea}</span>}
          </div>
        </div>

        {/* ── IDENTITY & CONTACT ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader} style={{ borderColor: '#7c3aed' }}>
            <span className={styles.cardIcon}>🪪</span>
            <h2 className={styles.cardTitle}>{t.secIdentity}</h2>
          </div>
          <div className={styles.grid2}>
            <div className={styles.field} data-error={!!fieldErrors.doorNumber}>
              <label className={styles.label}>{t.doorNumber}</label>
              <input
                className={`${styles.input} ${fieldErrors.doorNumber ? styles.inputError : ''}`}
                placeholder={t.doorPlaceholder}
                name="doorNumber"
                value={form.doorNumber}
                onChange={handleChange}
              />
              {fieldErrors.doorNumber && <span className={styles.errorText}>{fieldErrors.doorNumber}</span>}
            </div>
            <div className={styles.field} data-error={!!fieldErrors.familyHead}>
              <label className={styles.label}>{t.familyHead}</label>
              <input
                className={`${styles.input} ${fieldErrors.familyHead ? styles.inputError : ''}`}
                placeholder={t.familyHeadPlaceholder}
                name="familyHead"
                value={form.familyHead}
                onChange={handleChange}
              />
              {fieldErrors.familyHead && <span className={styles.errorText}>{fieldErrors.familyHead}</span>}
            </div>
          </div>

          {/* Mobile Numbers */}
          <div className={styles.field} style={{ marginTop: 14 }} data-error={!!fieldErrors.mobile}>
            <label className={styles.label}>{t.mobileNumbers}</label>
            {fieldErrors.mobile && <span className={styles.errorText}>{fieldErrors.mobile}</span>}
            {mobileNumbers.map((val, i) => (
              <div key={i} className={styles.mobileRow}>
                <input
                  className={`${styles.input} ${fieldErrors[`mobile_${i}`] ? styles.inputError : ''}`}
                  placeholder={`${t.mobilePlaceholder} ${i + 1}`}
                  value={val}
                  maxLength={10}
                  onChange={e => {
                    const newM = [...mobileNumbers];
                    newM[i] = e.target.value.replace(/\D/g, '');
                    setMobileNumbers(newM);
                    if (fieldErrors[`mobile_${i}`]) setFieldErrors(prev => ({ ...prev, [`mobile_${i}`]: '' }));
                  }}
                />
                {i === 0
                  ? <button type="button" className={styles.mobileAdd} onClick={() => setMobileNumbers([...mobileNumbers, ''])}>{t.addMobile}</button>
                  : <button type="button" className={styles.mobileRemove} onClick={() => setMobileNumbers(mobileNumbers.filter((_, idx) => idx !== i))}>{t.removeMobile}</button>
                }
                {fieldErrors[`mobile_${i}`] && <span className={styles.errorText} style={{ width: '100%' }}>{fieldErrors[`mobile_${i}`]}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* ── HOUSEHOLD PROFILE ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader} style={{ borderColor: '#059669' }}>
            <span className={styles.cardIcon}>🏠</span>
            <h2 className={styles.cardTitle}>{t.secHousehold}</h2>
          </div>
          <div className={styles.grid3}>
            <div className={styles.field} data-error={!!fieldErrors.familyMembers}>
              <label className={styles.label}>{t.familyMembers}</label>
              <input
                className={`${styles.input} ${fieldErrors.familyMembers ? styles.inputError : ''}`}
                type="number" placeholder={t.familyMembersPlaceholder}
                name="familyMembers" value={form.familyMembers}
                onChange={handleChange} min={1}
              />
              {fieldErrors.familyMembers && <span className={styles.errorText}>{fieldErrors.familyMembers}</span>}
            </div>

            <div className={styles.field} data-error={!!fieldErrors.familyType}>
              <label className={styles.label}>{t.familyType}</label>
              <select
                className={`${styles.select} ${fieldErrors.familyType ? styles.inputError : ''}`}
                name="familyType" value={form.familyType} onChange={handleChange}
              >
                <option value="">{t.selectType}</option>
                <option value="Nuclear Family">{t.nuclear}</option>
                <option value="Joint Family">{t.joint}</option>
              </select>
              {fieldErrors.familyType && <span className={styles.errorText}>{fieldErrors.familyType}</span>}
            </div>

            <div className={styles.field} data-error={!!fieldErrors.occupation}>
              <label className={styles.label}>{t.occupation}</label>
              <select
                className={`${styles.select} ${fieldErrors.occupation ? styles.inputError : ''}`}
                name="occupation" value={form.occupation} onChange={handleChange}
              >
                <option value="">{t.selectOccupation}</option>
                <option value="Farming">{t.farming}</option>
                <option value="Daily wage worker">{t.dailyWage}</option>
                <option value="Private job">{t.privateJob}</option>
                <option value="Government job">{t.govtJob}</option>
                <option value="Business">{t.business}</option>
                <option value="Other">{t.other}</option>
              </select>
              {fieldErrors.occupation && <span className={styles.errorText}>{fieldErrors.occupation}</span>}
            </div>
          </div>
        </div>

        {/* ── MONTHLY CONSUMPTION ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader} style={{ borderColor: '#d97706' }}>
            <span className={styles.cardIcon}>🛒</span>
            <h2 className={styles.cardTitle}>{t.secConsumption}</h2>
          </div>
          <p className={styles.hint}>{t.consumptionHint}</p>
          {fieldErrors.consumption && (
            <div className={styles.errorBanner} data-error="true">⚠️ {fieldErrors.consumption}</div>
          )}
          <div className={styles.consumptionGrid}>
            {consumptionItems.map(item => (
              <div key={item.key} className={styles.consumptionItem}>
                <label className={styles.consumptionLabel}>
                  <span style={{ marginRight: 5 }}>{item.icon}</span>
                  {item.label[lang]}
                </label>
                <input
                  className={styles.consumptionInput}
                  placeholder={item.placeholder[lang]}
                  value={form.consumption[item.key] || ''}
                  onChange={e => handleConsumptionChange(item.key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── SHOPPING PREFERENCES ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader} style={{ borderColor: '#db2777' }}>
            <span className={styles.cardIcon}>📊</span>
            <h2 className={styles.cardTitle}>{t.secPreferences}</h2>
          </div>
          <div className={styles.grid2}>

            <div className={styles.field} data-error={!!fieldErrors.grocerySource}>
              <label className={styles.label}>{t.grocerySource}</label>
              <select className={`${styles.select} ${fieldErrors.grocerySource ? styles.inputError : ''}`} name="grocerySource" value={form.grocerySource} onChange={handleChange}>
                <option value="">{t.selectSource}</option>
                <option value="Local Kirana shop">{t.localKirana}</option>
                <option value="Weekly market">{t.weeklyMarket}</option>
                <option value="Town supermarket">{t.townSuper}</option>
                <option value="Online">{t.online}</option>
              </select>
              {fieldErrors.grocerySource && <span className={styles.errorText}>{fieldErrors.grocerySource}</span>}
            </div>

            <div className={styles.field} data-error={!!fieldErrors.monthlySpending}>
              <label className={styles.label}>{t.monthlySpend}</label>
              <select className={`${styles.select} ${fieldErrors.monthlySpending ? styles.inputError : ''}`} name="monthlySpending" value={form.monthlySpending} onChange={handleChange}>
                <option value="">{t.selectRange}</option>
                <option value="2000-3000">{t.spend1}</option>
                <option value="3000-5000">{t.spend2}</option>
                <option value="custom">{t.spend3}</option>
              </select>
              {fieldErrors.monthlySpending && <span className={styles.errorText}>{fieldErrors.monthlySpending}</span>}
              {form.monthlySpending === 'custom' && (
                <>
                  <input
                    className={`${styles.input} ${fieldErrors.monthlySpendingCustom ? styles.inputError : ''}`}
                    style={{ marginTop: 8 }}
                    type="number"
                    placeholder={t.exactAmount}
                    name="monthlySpendingCustom"
                    value={form.monthlySpendingCustom}
                    onChange={handleChange}
                    min={5001}
                  />
                  {fieldErrors.monthlySpendingCustom && <span className={styles.errorText}>{fieldErrors.monthlySpendingCustom}</span>}
                </>
              )}
            </div>

            <div className={styles.field} data-error={!!fieldErrors.purchaseFrequency}>
              <label className={styles.label}>{t.purchaseFreq}</label>
              <select className={`${styles.select} ${fieldErrors.purchaseFrequency ? styles.inputError : ''}`} name="purchaseFrequency" value={form.purchaseFrequency} onChange={handleChange}>
                <option value="">{t.selectFreq}</option>
                <option value="Daily">{t.daily}</option>
                <option value="Weekly">{t.weekly}</option>
                <option value="Once a month">{t.monthly}</option>
              </select>
              {fieldErrors.purchaseFrequency && <span className={styles.errorText}>{fieldErrors.purchaseFrequency}</span>}
            </div>

            <div className={styles.field} data-error={!!fieldErrors.brandedPreference}>
              <label className={styles.label}>{t.brandedPref}</label>
              <select className={`${styles.select} ${fieldErrors.brandedPreference ? styles.inputError : ''}`} name="brandedPreference" value={form.brandedPreference} onChange={handleChange}>
                <option value="">{t.selectPref}</option>
                <option value="Yes">{t.yes}</option>
                <option value="No">{t.no}</option>
                <option value="Sometimes">{t.sometimes}</option>
              </select>
              {fieldErrors.brandedPreference && <span className={styles.errorText}>{fieldErrors.brandedPreference}</span>}
            </div>

            <div className={styles.field} data-error={!!fieldErrors.productType}>
              <label className={styles.label}>{t.productType}</label>
              <select className={`${styles.select} ${fieldErrors.productType ? styles.inputError : ''}`} name="productType" value={form.productType} onChange={handleChange}>
                <option value="">{t.selectPType}</option>
                <option value="Loose products">{t.loose}</option>
                <option value="Packaged products">{t.packaged}</option>
              </select>
              {fieldErrors.productType && <span className={styles.errorText}>{fieldErrors.productType}</span>}
            </div>

            <div className={styles.field} data-error={!!fieldErrors.cheaperOption}>
              <label className={styles.label}>{t.digitalSuper}</label>
              <select className={`${styles.select} ${fieldErrors.cheaperOption ? styles.inputError : ''}`} name="cheaperOption" value={form.cheaperOption} onChange={handleChange}>
                <option value="">{t.selectOption}</option>
                <option value="Yes">{t.yes}</option>
                <option value="No">{t.no}</option>
              </select>
              {fieldErrors.cheaperOption && <span className={styles.errorText}>{fieldErrors.cheaperOption}</span>}
            </div>

          </div>
        </div>

        {/* Server Error */}
        {serverError && <div className={styles.errorBanner}>⚠️ {serverError}</div>}

        {/* Submit */}
        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting
            ? <><span className={styles.spinner} /> {t.submitting}</>
            : t.submitBtn
          }
        </button>

      </form>
    </div>
  );
}

function SuccessCard({ t, onReset }) {
  return (
    <div className={styles.successPage}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>
          <CheckCircle size={64} color="#16a34a" />
        </div>
        <h2 className={styles.successTitle}>{t.successTitle}</h2>
        <p className={styles.successSub}>{t.successSub}</p>
        <button className={styles.newSurveyBtn} onClick={onReset}>
          {t.newSurvey}
        </button>
      </div>
    </div>
  );
}
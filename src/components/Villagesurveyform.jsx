import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ClipboardCheck, CheckCircle } from 'lucide-react';
import styles from './Villagesurveyform.module.css';
import axios from 'axios';

const consumptionItems = [
  { key: 'rice',       label: 'Rice'              },
  { key: 'wheat',      label: 'Wheat / Atta'      },
  { key: 'toorDal',    label: 'Toor Dal'          },
  { key: 'moongDal',   label: 'Moong Dal'         },
  { key: 'chanaDal',   label: 'Chana Dal'         },
  { key: 'oil',        label: 'Cooking Oil'       },
  { key: 'sugar',      label: 'Sugar'             },
  { key: 'salt',       label: 'Salt'              },
  { key: 'tea',        label: 'Tea Powder'        },
  { key: 'milk',       label: 'Milk'              },
  { key: 'eggs',       label: 'Eggs'              },
  { key: 'bathSoap',   label: 'Bath Soap'         },
  { key: 'shampoo',    label: 'Shampoo'           },
  { key: 'detergent',  label: 'Detergent Powder'  },
  { key: 'dishWash',   label: 'Dish Wash'         },
  { key: 'toothpaste', label: 'Toothpaste'        },
];

// ─── Parse "10 kg" → { value: 10, unit: "kg", originalInput: "10 kg" } ────────
// Handles: "10 kg", "2L", "1 dozen", "500g", "3", etc.
function parseConsumptionInput(raw = '') {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  const match = trimmed.match(/^(\d+(\.\d+)?)\s*([a-zA-Z]*)$/);
  if (match) {
    return {
      value: parseFloat(match[1]),
      unit: match[3] || '',
      originalInput: trimmed,
    };
  }
  // Fallback: couldn't parse numerically — store as-is with value 0
  return { value: 0, unit: '', originalInput: trimmed };
}

export default function VillageSurveyForm() {
  // FIX 1: backend expects surveyorId (lowercase s), not SurveyorId
  const agentData = useSelector(state => state.auth?.user || {});

  const [states,    setStates]    = useState([]);
  const [districts, setDistricts] = useState([]);
  const [mandals,   setMandals]   = useState([]);
  const [villages,  setVillages]  = useState([]);
  const [loading,   setLoading]   = useState({ state: false, dist: false, mandal: false, village: false });

  const [selection, setSelection] = useState({
    stateName: '', districtName: '', mandalName: '', villageName: '',
    stateId: '', districtId: '', mandalId: '',
    // FIX 2: track villageId separately — backend needs it for subagent count update
    villageId: '',
  });

  const [mobileNumbers, setMobileNumbers] = useState(['']);
  const [form, setForm] = useState({
    wardArea: '', doorNumber: '', familyHead: '',
    familyMembers: '', familyType: '', occupation: '',
    grocerySource: '', monthlySpending: '', monthlySpendingCustom: '', purchaseFrequency: '',
    brandedPreference: '', productType: '', cheaperOption: '',
    orderMethod: '',
    // raw string inputs keyed by consumptionItem.key
    consumption: {},
    otherProduct: '', surveyorNote: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted,  setIsSubmitted]  = useState(false);
  const [error,        setError]        = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Store raw string in form state; parsing happens at submit time
  const handleConsumptionChange = (key, value) => {
    setForm(prev => ({ ...prev, consumption: { ...prev.consumption, [key]: value } }));
  };

  // ── Load states on mount ──────────────────────────────────────────────────
  useEffect(() => {
    setLoading(p => ({ ...p, state: true }));
    axios.get('/survey/states')
      .then(res => setStates(res.data.data || res.data))
      .finally(() => setLoading(p => ({ ...p, state: false })));
  }, []);

  // FIX 3: original code called onStateSelect(e.target.value) — passing a string
  // instead of the event object, so e.target was undefined inside the handler.
  // Now the handler receives the real event (e).
  const onStateSelect = (e) => {
    const id   = e.target.value;
    const name = states.find(s => s._id === id)?.name;
    setSelection({
      stateId: id, stateName: name,
      districtId: '', districtName: '',
      mandalId: '',  mandalName: '',
      villageId: '', villageName: '',
    });
    setDistricts([]); setMandals([]); setVillages([]);
    if (!id) return;
    setLoading(p => ({ ...p, dist: true }));
    axios.get(`/survey/districts/state/${id}`)
      .then(res => setDistricts(res.data.data || res.data))
      .finally(() => setLoading(p => ({ ...p, dist: false })));
  };

  const onDistrictSelect = (e) => {
    const id   = e.target.value;
    const name = districts.find(d => d._id === id)?.name;
    setSelection(prev => ({
      ...prev,
      districtId: id, districtName: name,
      mandalId: '', mandalName: '',
      villageId: '', villageName: '',
    }));
    setMandals([]); setVillages([]);
    if (!id) return;
    setLoading(p => ({ ...p, mandal: true }));
    axios.get(`/survey/mandals/${id}`)
      .then(res => setMandals(res.data.data || res.data))
      .finally(() => setLoading(p => ({ ...p, mandal: false })));
  };

  const onMandalSelect = (e) => {
    const id   = e.target.value;
    const name = mandals.find(m => m._id === id)?.name;
    setSelection(prev => ({
      ...prev,
      mandalId: id, mandalName: name,
      villageId: '', villageName: '',
    }));
    setVillages([]);
    if (!id) return;
    setLoading(p => ({ ...p, village: true }));
    axios.get(`/survey/Villages/${id}`)
      .then(res => setVillages(res.data.data || res.data))
      .finally(() => setLoading(p => ({ ...p, village: false })));
  };


  const onVillageSelect = (e) => {
    const raw = e.target.value; // could be "_id" or plain village name string
    const found = villages.find(v => (v._id || v) === raw);
    const id   = found?._id   || '';      // may be empty if villages are plain strings
    const name = found?.name  || raw;     // fall back to raw string
    setSelection(prev => ({ ...prev, villageId: id, villageName: name }));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selection.villageName) { setError('Please select a Village'); return; }
    setError('');
    setIsSubmitting(true);

    // 1. Parse Consumption
    const parsedConsumption = {};
    for (const item of consumptionItems) {
      const parsed = parseConsumptionInput(form.consumption[item.key]);
      if (parsed) parsedConsumption[item.key] = parsed;
    }

    // 2. Prepare Payload
    const payload = {
      // Basic Fields
      wardArea:          form.wardArea,
      doorNumber:        form.doorNumber,
      familyHead:        form.familyHead,
      familyMembers:     form.familyMembers,
      familyType:        form.familyType,
      occupation:        form.occupation,
      grocerySource:     form.grocerySource,
      monthlySpending:   form.monthlySpending === 'custom'
                           ? form.monthlySpendingCustom
                           : form.monthlySpending,
      purchaseFrequency: form.purchaseFrequency,
      brandedPreference: form.brandedPreference,
      productType:       form.productType,
      cheaperOption:     form.cheaperOption,
      orderMethod:       form.orderMethod,
      consumption:       parsedConsumption,

      // Contact
      mobile: mobileNumbers.filter(m => m.length === 10),

      // --- THE FIX IS HERE ---
      // Logic: Use manual input if provided, otherwise use the logged-in agent's ID
      surveyorId: form.surveyorId,

      // Village/Location Info
      villageId:    selection.villageId,
      surveyDate:   new Date().toISOString().split('T')[0],
      stateName:    selection.stateName,
      districtName: selection.districtName,
      MandalName:   selection.mandalName,
      VillageName:  selection.villageName,
    };

    console.log("Payload being sent:", payload); // Debugging line

    try {
      // Use the full URL if not proxied in package.json
      await axios.post('/survey/surveys/form', payload);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Submission Error:", err.response?.data || err.message);
      setError('Submission failed: ' + (err.response?.data?.error || 'Server error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) return <SuccessCard onReset={() => setIsSubmitted(false)} />;

  return (
    <div className={styles.page}>

      {/* Top bar */}
      <div className={styles.topbar}>
        <ClipboardCheck size={22} color="#2563eb" />
        <h1 className={styles.topbarTitle}>Village Survey</h1>
        {(agentData?.surveyorId || agentData?.SurveyorId) && (
          <span className={styles.agentBadge}>
            ID: {agentData?.surveyorId || agentData?.SurveyorId}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>

        {/* ── LOCATION ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader} style={{ borderColor: '#2563eb' }}>
            <span className={styles.cardIcon}>📍</span>
            <h2 className={styles.cardTitle}>Location</h2>
          </div>
          <div className={styles.grid4}>

            <div className={styles.field}>
              <label className={styles.label}>
                State {loading.state && <span className={styles.loading}>Loading…</span>}
              </label>
              {/* FIX 3: pass event object (e), not e.target.value */}
              <select className={styles.select} value={selection.stateId} onChange={onStateSelect}>
                <option value="">Select State</option>
                {states.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                District {loading.dist && <span className={styles.loading}>Loading…</span>}
              </label>
              <select
                className={styles.select}
                value={selection.districtId}
                onChange={onDistrictSelect}
                disabled={!districts.length}
              >
                <option value="">Select District</option>
                {districts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Mandal {loading.mandal && <span className={styles.loading}>Loading…</span>}
              </label>
              <select
                className={styles.select}
                value={selection.mandalId}
                onChange={onMandalSelect}
                disabled={!mandals.length}
              >
                <option value="">Select Mandal</option>
                {mandals.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Village {loading.village && <span className={styles.loading}>Loading…</span>}
              </label>
              {/* FIX 4: added onChange handler; handle both object and string village shapes */}
              <select
                className={styles.select}
                value={selection.villageId || selection.villageName}
                onChange={onVillageSelect}
                disabled={!villages.length}
              >
                <option value="">Select Village</option>
                {villages.map((v, i) => {
                  const val  = v._id  || v;
                  const label = v.name || v;
                  return <option key={`${val}-${i}`} value={val}>{label}</option>;
                })}
              </select>
            </div>

          </div>
          <div className={styles.field} style={{ marginTop: 14 }}>
            <label className={styles.label}>surveyorId(optional)</label>
            <input
              className={styles.input}
              placeholder="Enter surveyor Id"
              name="surveyorId"
              value={form.surveyorId}
              onChange={handleChange}
              
            />
          </div>
          <div className={styles.field} style={{ marginTop: 14 }}>
            <label className={styles.label}>Ward / Area Name *</label>
            <input
              className={styles.input}
              placeholder="Enter ward or area name"
              name="wardArea"
              value={form.wardArea}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* ── IDENTITY & CONTACT ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader} style={{ borderColor: '#7c3aed' }}>
            <span className={styles.cardIcon}>🪪</span>
            <h2 className={styles.cardTitle}>Identity & Contact</h2>
          </div>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>House Door Number *</label>
              <input
                className={styles.input}
                placeholder="e.g. 12-34"
                name="doorNumber"
                value={form.doorNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Family Head Name *</label>
              <input
                className={styles.input}
                placeholder="Full name"
                name="familyHead"
                value={form.familyHead}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Mobile numbers */}
          <div className={styles.field} style={{ marginTop: 14 }}>
            <label className={styles.label}>Mobile Numbers</label>
            {mobileNumbers.map((val, i) => (
              <div key={i} className={styles.mobileRow}>
                <input
                  className={styles.input}
                  placeholder={`Mobile ${i + 1}`}
                  value={val}
                  maxLength={10}
                  onChange={e => {
                    const newM = [...mobileNumbers];
                    newM[i] = e.target.value.replace(/\D/g, '');
                    setMobileNumbers(newM);
                  }}
                />
                {i === 0
                  ? <button type="button" className={styles.mobileAdd} onClick={() => setMobileNumbers([...mobileNumbers, ''])}>+ Add</button>
                  : <button type="button" className={styles.mobileRemove} onClick={() => setMobileNumbers(mobileNumbers.filter((_, idx) => idx !== i))}>Remove</button>
                }
              </div>
            ))}
          </div>
        </div>

        {/* ── HOUSEHOLD PROFILE ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader} style={{ borderColor: '#059669' }}>
            <span className={styles.cardIcon}>🏠</span>
            <h2 className={styles.cardTitle}>Household Profile</h2>
          </div>
          <div className={styles.grid3}>
            <div className={styles.field}>
              <label className={styles.label}>Total Family Members *</label>
              <input
                className={styles.input}
                type="number"
                placeholder="e.g. 4"
                name="familyMembers"
                value={form.familyMembers}
                onChange={handleChange}
                required
                min={1}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Family Type *</label>
              <select className={styles.select} name="familyType" value={form.familyType} onChange={handleChange} required>
                <option value="">Select type</option>
                <option value="Nuclear Family">Nuclear Family</option>
                <option value="Joint Family">Joint Family</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Occupation *</label>
              <select className={styles.select} name="occupation" value={form.occupation} onChange={handleChange} required>
                <option value="">Select occupation</option>
                <option value="Farming">Farming</option>
                <option value="Daily wage worker">Daily wage worker</option>
                <option value="Private job">Private job</option>
                <option value="Government job">Government job</option>
                <option value="Business">Business</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── MONTHLY CONSUMPTION ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader} style={{ borderColor: '#d97706' }}>
            <span className={styles.cardIcon}>🛒</span>
            <h2 className={styles.cardTitle}>Monthly Consumption</h2>
          </div>
          {/* FIX 5: hint updated — inputs are parsed into { value, unit, originalInput } on submit */}
          <p className={styles.hint}>Specify quantity with unit — e.g. 10 kg, 2 L, 1 dozen</p>
          <div className={styles.consumptionGrid}>
            {consumptionItems.map(item => (
              <div key={item.key} className={styles.consumptionItem}>
                <label className={styles.consumptionLabel}>{item.label}</label>
                <input
                  className={styles.consumptionInput}
                  placeholder="e.g. 10 kg"
                  value={form.consumption[item.key] || ''}
                  onChange={e => handleConsumptionChange(item.key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── PREFERENCES ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader} style={{ borderColor: '#db2777' }}>
            <span className={styles.cardIcon}>📊</span>
            <h2 className={styles.cardTitle}>Shopping Preferences</h2>
          </div>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Grocery Source *</label>
              <select className={styles.select} name="grocerySource" value={form.grocerySource} onChange={handleChange} required>
                <option value="">Select source</option>
                <option value="Local Kirana shop">Local Kirana shop</option>
                <option value="Weekly market">Weekly market</option>
                <option value="Town supermarket">Town supermarket</option>
                <option value="Online">Online</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Monthly Spend (₹) *</label>
              <select
                className={styles.select}
                name="monthlySpending"
                value={form.monthlySpending}
                onChange={handleChange}
                required
              >
                <option value="">Select range</option>
                <option value="2000-3000">₹2,000 – ₹3,000</option>
                <option value="3000-5000">₹3,000 – ₹5,000</option>
                <option value="custom">More than ₹5,000</option>
              </select>
              {form.monthlySpending === 'custom' && (
                <input
                  className={styles.input}
                  style={{ marginTop: 8 }}
                  type="number"
                  placeholder="Enter exact amount (₹)"
                  name="monthlySpendingCustom"
                  value={form.monthlySpendingCustom}
                  onChange={handleChange}
                  required
                  min={5001}
                />
              )}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Purchase Frequency *</label>
              <select className={styles.select} name="purchaseFrequency" value={form.purchaseFrequency} onChange={handleChange} required>
                <option value="">Select frequency</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Once a month">Once a month</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Prefer Branded Products? *</label>
              <select className={styles.select} name="brandedPreference" value={form.brandedPreference} onChange={handleChange} required>
                <option value="">Select preference</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Sometimes">Sometimes</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Loose vs Packaged? *</label>
              <select className={styles.select} name="productType" value={form.productType} onChange={handleChange} required>
                <option value="">Select type</option>
                <option value="Loose products">Loose products</option>
                <option value="Packaged products">Packaged products</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Open to Digital Supermarket? *</label>
              <select className={styles.select} name="cheaperOption" value={form.cheaperOption} onChange={handleChange} required>
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <div className={styles.errorBanner}>⚠️ {error}</div>}

        {/* Submit */}
        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? (
            <><span className={styles.spinner} /> Syncing Survey…</>
          ) : (
            '📤  Submit Survey'
          )}
        </button>

      </form>
    </div>
  );
}

function SuccessCard({ onReset }) {
  return (
    <div className={styles.successPage}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>
          <CheckCircle size={64} color="#16a34a" />
        </div>
        <h2 className={styles.successTitle}>Survey Submitted!</h2>
        <p className={styles.successSub}>Data has been synced successfully.</p>
        <button className={styles.newSurveyBtn} onClick={onReset}>
          + Start New Survey
        </button>
      </div>
    </div>
  );
}

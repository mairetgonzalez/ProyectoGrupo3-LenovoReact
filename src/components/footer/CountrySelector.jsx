// 🇧🇷 Seletor de país com react-select (ES/US/BR)
import { useMemo, useState } from 'react';
import Select, { components } from 'react-select';

// ► Opções usando arquivos em /public/assets/...
const COUNTRY_OPTIONS = [
  { value: 'ES', label: 'ESPAÑA',         flag: '/assets/flags/flag-espanhol.png' },
  { value: 'US', label: 'ESTADOS UNIDOS', flag: '/assets/flags/flag-ingles.png' },
  { value: 'BR', label: 'BRASIL',         flag: '/assets/flags/flag-portugues.png' },
];

const Option = (props) => (
  <components.Option {...props}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <img src={props.data.flag} alt="" width={18} height={18} />
      <span>{props.data.label}</span>
    </div>
  </components.Option>
);

const SingleValue = (props) => (
  <components.SingleValue {...props}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <img src={props.data.flag} alt="" width={18} height={18} />
      <span>{props.data.label}</span>
    </div>
  </components.SingleValue>
);

export default function CountrySelector() {
  const [country, setCountry] = useState(COUNTRY_OPTIONS[0]);

  const styles = useMemo(() => ({
    control: (base, state) => ({
      ...base,
      minHeight: 44,
      borderRadius: 12,
      borderColor: state.isFocused ? 'var(--lenovo-red)' : 'var(--lenovo-gray)',
      boxShadow: state.isFocused ? '0 0 0 1px var(--lenovo-red)' : 'none',
      '&:hover': { borderColor: 'var(--lenovo-red)' },
      backgroundColor: 'var(--white)',
    }),
    valueContainer: (b) => ({ ...b, padding: '6px 12px' }),
    placeholder: (b) => ({ ...b, color: 'var(--muted)' }),
    dropdownIndicator: (b) => ({ ...b, color: 'var(--black)' }),
    menu: (b) => ({ ...b, border: '1px solid var(--lenovo-gray)', borderRadius: 12, overflow: 'hidden', zIndex: 20 }),
    menuList: (b) => ({ ...b, maxHeight: 240 }),
    option: (b, s) => ({
      ...b,
      backgroundColor: s.isSelected ? 'rgba(225, 20, 10, 0.08)'
        : s.isFocused ? 'var(--lenovo-light-gray)' : 'var(--white)',
      color: 'var(--black)', padding: '10px 12px', cursor: 'pointer',
    }),
    singleValue: (b) => ({ ...b, color: 'var(--black)', fontWeight: 600 }),
  }), []);

  return (
    <div className="country-select-wrap">
      <label className="country-label" htmlFor="country-select">Selecionar País/Região:</label>
      <Select
        inputId="country-select"
        instanceId="country-select"
        options={COUNTRY_OPTIONS}
        value={country}
        onChange={setCountry}
        components={{ Option, SingleValue }}
        styles={styles}
        isSearchable
        menuPlacement="auto"
        placeholder="País"
      />
    </div>
  );
}

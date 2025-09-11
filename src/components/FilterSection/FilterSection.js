import { useState } from "react";
import styles from "./FilterSection.module.css";

function FilterSection({ title, options, selected, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className={styles.filterSection}>
      <div className={styles.header} onClick={toggleOpen}>
        <h4>{title} <span>{isOpen ? "▲" : "▼"}</span></h4>
        
      </div>
      {isOpen && (
        <div className={styles.options}>
          {options.map(option => (
            <label key={option} className={styles.option}>
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
    <span className={styles.customCheckbox}></span>
    {option}
  </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterSection;
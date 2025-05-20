import React from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const CircleChart = ({data}) => {
  return (
    <div style={{ display: 'flex', gap: '40px' }}>
      {Object.entries(data).map(([label, value]) => (
        <div key={label} style={{ width: 120, textAlign: 'center' }}>
          <CircularProgressbar
            value={value}
            text={`${value}%`}
            styles={buildStyles({
              pathColor: value >= 90 ? "#05df72" : value >= 70 ? "#fdc700" : "#e7000b",
              textColor: "#ffffff",
              trailColor: "#d6d6d6"
            })}
          />
          <div style={{ marginTop: '10px', fontWeight: 'bold' }} className='text-white'>{label}</div>
        </div>
      ))}
    </div>
  );
};

export default CircleChart;

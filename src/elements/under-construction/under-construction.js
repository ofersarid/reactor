import React from 'react';
import { Build } from 'styled-icons/material/Build';
import styles from './styles.scss';

const UnderConstruction = () => (
  <div className={styles.underConstruction} >
    <Build />
    <br />
    <div>This page is under construction</div>
  </div >
);

export default UnderConstruction;

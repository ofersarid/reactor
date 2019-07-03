import React from 'react';
import { Linkedin } from 'styled-icons/fa-brands/Linkedin';
import { Profile } from 'styled-icons/icomoon/Profile';

const capitalize = word => {
  return word.charAt(0).toUpperCase() + word.substring(1);
};

export const toCapitalizedWords = name => {
  var words = name.match(/[A-Za-z][a-z]*/g) || [];

  return words.map(capitalize).join(' ');
};

export const validateEmail = email => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
  return re.test(String(email).toLowerCase());
};

export const validatePhone = phone => {
  return phone.replace(/\D/g, '').length >= 9;
};

const validateLink = str => {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
};

export const toTitleCase = str => {
  return str.replace(/\w\S*/g, txt => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const resolveSocialIconByURL = (url, className) => {
  switch (true) {
    case Boolean(url.match(/^https:\/\/www.linkedin.com/i)):
      return <Linkedin className={className} />;
    default:
      return <Profile className={className} />;
  }
};

export const youtubeEmbedTransformer = urlStr => {
  return urlStr ? `https://www.youtube-nocookie.com/embed/${urlStr.split('/').pop().split('v=').pop()}` : '';
};

export const exportToCsv = (filename, rows) => {
  let csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default {
  toCapitalizedWords,
  validateEmail,
  validatePhone,
  toTitleCase,
  resolveSocialIconByURL,
  youtubeEmbedTransformer,
  exportToCsv,
  validateLink,
};

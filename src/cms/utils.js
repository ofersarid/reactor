import React from 'react';
import { Linkedin } from 'styled-icons/fa-brands/Linkedin';
import { Profile } from 'styled-icons/icomoon/Profile';
// import Resizer from 'react-image-file-resizer';

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

const dataURLToBlob = (dataURL) => {
  const BASE64_MARKER = ';base64,';
  if (dataURL.indexOf(BASE64_MARKER) === -1) {
    const parts = dataURL.split(',');
    const contentType = parts[0].split(':')[1];
    const raw = parts[1];

    return new Blob([raw], { type: contentType });
  }

  const parts = dataURL.split(BASE64_MARKER);
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;

  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
};

export const imageOptimizer = (imgFile, options) => {
  return new Promise(resolve => {
    // Load the image
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = (imageEvent) => {
        // Resize the image
        const canvas = document.createElement('canvas');
        const maxSize = options.maxSize;
        let width = image.width;
        let height = image.height;
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(imgFile.type);
        const resizedImage = dataURLToBlob(dataUrl);
        resolve(new File([resizedImage], imgFile.name, {
          type: imgFile.type,
        }));
      };
      image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(imgFile);
  });
};

export const rotateImage90Deg = imgFile => {
  return new Promise(resolve => {
    // Load the image
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.height;
        canvas.height = image.width;
        const ctx = canvas.getContext('2d');
        ctx.save();
        const angle = 90 * Math.PI / 180;
        ctx.translate(Math.abs(image.width / 2 * Math.cos(angle) + image.height / 2 * Math.sin(angle)), Math.abs(image.height / 2 * Math.cos(angle) + image.width / 2 * Math.sin(angle)));
        ctx.rotate(angle);
        ctx.translate(-image.width / 2, -image.height / 2);
        ctx.drawImage(image, 0, 0);
        ctx.restore();
        const dataUrl = canvas.toDataURL(imgFile.type);
        resolve(new File([dataURLToBlob(dataUrl)], imgFile.name, {
          type: imgFile.type,
        }));
      };
      image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(imgFile);
  });
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

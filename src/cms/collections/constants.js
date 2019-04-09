import React from 'react';
import { Contact } from 'styled-icons/boxicons-solid/Contact';
import { Event } from 'styled-icons/material/Event';
import { Group } from 'styled-icons/boxicons-solid/Group';
import { CartAlt } from 'styled-icons/boxicons-solid/CartAlt';
import { validateEmail } from '/src/utils';

export const COLLECTIONS = [
  {
    id: 'contacts',
    name: 'Contacts',
    icon: <Contact />,
    filters: ['title', 'subscribedToNewsLetter'],
    sortOptions: ['title', 'created', 'subscribedToNewsLetter'],
    fields: [{
      key: 'title',
      label: 'Name',
      type: 'single-line',
      required: true,
      min: 1,
      max: 40,
    }, {
      key: 'email',
      label: 'Email',
      type: 'link',
      validateWith: validateEmail,
      required: true,
    }, {
      key: 'created',
      label: 'Created',
      type: 'date-time',
      disabled: true,
      initialValue: new Date(),
    }, {
      key: 'subscribedToNewsLetter',
      label: 'News Letter',
      type: 'switch',
      initialValue: false,
    }],
  }, {
    id: 'events',
    name: 'Events',
    icon: <Event />,
    filters: ['title', 'description'],
    sortOptions: ['dateTime', 'title'],
    fields: [{
      key: 'title',
      label: 'Title',
      type: 'single-line',
      required: true,
      min: 1,
      max: 40,
      initialValue: 'My Event',
    }, {
      key: 'description',
      label: 'Description',
      type: 'multi-line',
      required: true,
      min: 1,
      max: 250,
      initialValue: 'My Description',
    }, {
      key: 'pic',
      label: 'Picture',
      type: 'image',
      required: true,
    }, {
      key: 'dateTime',
      label: 'Date & Time',
      type: 'date-time',
      initialValue: new Date(),
    }, {
      key: 'post',
      label: 'Post',
      type: 'post',
      required: true,
      min: 1,
    }, {
      key: 'active',
      label: 'Activate',
      type: 'switch',
      initialValue: false,
    }],
  }, {
    id: 'team',
    name: 'Team',
    icon: <Group />,
    filters: ['title', 'description'],
    sortOptions: ['displayOrder', 'title', 'description'],
    fields: [{
      key: 'title',
      label: 'Name',
      type: 'single-line',
      required: true,
      min: 1,
      max: 40,
      initialValue: 'My Name',
    }, {
      key: 'description',
      label: 'Description',
      type: 'multi-line',
      required: true,
      min: 1,
      max: 40,
      initialValue: 'About Me',
    }, {
      key: 'pic',
      label: 'Picture',
      type: 'image',
      required: true,
    }, {
      key: 'email',
      label: 'Email',
      type: 'link',
      required: true,
      validateWith: validateEmail,
    }, {
      key: 'socialProfile',
      label: 'Social Profile',
      type: 'link',
    }, {
      key: 'active',
      label: 'Activate',
      type: 'switch',
      initialValue: false,
    }, {
      key: 'displayOrder',
      label: 'Display Order',
      type: 'number',
      required: true,
    }],
  }, {
    id: 'products',
    name: 'Products',
    icon: <CartAlt />,
    filters: ['title', 'tagLine'],
    sortOptions: ['title', 'displayOrder'],
    fields: [{
      key: 'bannerColor',
      label: 'Banner Color',
      type: 'select',
      initialValue: 'blue',
      options: ['blue', 'red', 'green', 'yellow']
    }, {
      key: 'title',
      label: 'Title',
      type: 'single-line',
      required: true,
      min: 1,
      max: 40,
      initialValue: 'My Title',
    }, {
      key: 'tagLine',
      label: 'Tag-Line',
      type: 'single-line',
      required: true,
      min: 1,
      max: 40,
    }, {
      key: 'nvp',
      label: 'NVP %',
      type: 'number',
      required: true,
      min: 1,
      max: 100,
      initialValue: 95,
    }, {
      key: 'productImage',
      label: 'Product Image',
      type: 'image',
      required: true,
    }, {
      key: 'testimonial-1-pic',
      label: 'Testimonial #1 Pic',
      type: 'image',
    }, {
      key: 'testimonial-1-text',
      label: 'Testimonial #1 Text',
      type: 'single-line',
    }, {
      key: 'testimonial-1-name',
      label: 'Testimonial #1 Name',
      type: 'single-line',
    }, {
      key: 'video',
      label: 'Youtube Link',
      type: 'embed',
      transformer: value => value ? `https://www.youtube.com/embed/${value.split('/').pop().split('v=').pop()}` : '',
    }, {
      key: 'article',
      label: 'PDF',
      type: 'pdf',
    }, {
      key: 'created',
      label: 'Created',
      type: 'date-time',
      disabled: true,
      initialValue: new Date(),
    }, {
      key: 'active',
      label: 'Activate',
      type: 'switch',
      initialValue: false,
    }, {
      key: 'displayOrder',
      label: 'Display Order',
      type: 'number',
      required: true,
    }],
  }
];

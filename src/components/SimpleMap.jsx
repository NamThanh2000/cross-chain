import React from 'react';

const SimpleMap = () => {
  return (
    <iframe
      title='oceanover.tech'
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.234011576685!2d106.80257332546164!3d10.869797863081677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527587e9ad5bf%3A0xafa66f9c8be3c91!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVGjDtG5nIHRpbiAtIMSQSFFHIFRQLkhDTQ!5e0!3m2!1svi!2s!4v1686501116140!5m2!1svi!2s"
      width="640"
      height="400"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
};

export default SimpleMap;

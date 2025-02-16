import React from 'react';

const AngleIframe: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <iframe
        title="Identifying Angles Around Us"
        src="https://www.geogebra.org/material/iframe/id/apt9n822/width/800/height/500/border/888888/sfsb/true/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/false/rc/false/ld/false/sdz/false/ctl/false"
        width="600px"
        height="400px"
        style={{ border: '0px' }}
        scrolling="no"
      />
    </div>
  );
};

export default AngleIframe;

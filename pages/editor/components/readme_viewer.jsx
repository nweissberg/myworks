import { useEffect, useState } from 'react';
import {marked} from 'marked';
import beautify_js from 'js-beautify';
import hljs from 'highlight.js/lib/core';

// import the languages you need
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import xml from 'highlight.js/lib/languages/xml';
import ruby from 'highlight.js/lib/languages/ruby';
 


// import the styles you need // androidstudio | agate | rainbow | atom-one-dark |
import 'highlight.js/styles/rainbow.css';

// register the languages
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('python', python);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('ruby', ruby);


const ReadmeViewer = ({ url }) => {
  const [readmeContent, setReadmeContent] = useState('');
  useEffect(() => {
    const fetchReadme = async () => {
      try {
        const response = await fetch(url);
        const readmeText = await response.text();
		const docs = readmeText.split('---').filter(doc => doc.length > 0)
		console.log(docs)
        setReadmeContent(docs.at(-1) );
      } catch (error) {
        console.error('Error fetching README.md:', error);
      }
    };

    fetchReadme();
  }, [url]);

  const renderMarkdown = (text) => {
    const renderer = new marked.Renderer();

    // Customize how links are rendered
    renderer.link = (href, title, text) => {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    };

    // Customize how images are rendered
    renderer.image = (src, title, alt) => {
      return `<div class="flex flex-grow-1 h-max rounded-3xl overflow-hidden w-full max-w-auto justify-content-center "><img class="bg-auto bg-no-repeat bg-center bg-bluegray-900 border-round h-auto w-full max-w-min" src="${src}" alt="${alt}" /></div>`;
    };
	renderer.code = (code, language) => {
		console.log(language)
		if(language == undefined) language='ruby'
		if(language=='py') language = 'python'
		const beautifiedCode = beautify_js(code.replace(/\\\"/g, ''), {
			indent_size: 4,
			space_in_empty_paren: true,
		  });
		return `<pre class='hljs'><code class='horizontal-scrollbar bg-black-alpha-50 code-block language-${language}'>${beautifiedCode}</code></pre>`;
	  };

    marked.setOptions({ renderer });
    return marked(text);
  };
  useEffect(() => {
	var codes = document.getElementsByClassName('code-block');
	console.log(codes)
	if(codes) Object.values(codes).forEach(code => {
		if (code) {
			hljs.highlightBlock(code);
		}
	})
	
  },[readmeContent])
  return (
    <div className="readme-viewer ">
      <div style={{
		width: '100%',
		// width: '400px',
		height: '100%',
		whiteSpace:"wrap",
	}} dangerouslySetInnerHTML={{ __html: renderMarkdown(readmeContent) }} />
    </div>
  );
};

export default ReadmeViewer;

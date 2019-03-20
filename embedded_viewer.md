### Frameless Viewer

For embedded certificate rendering, we have provided a frameless view located at `/frameless_viewer`
There exists a hidden text input field on this page where you may inject the properly formatted string content from an OpenCert file, upon which the templating engine will attempt to render the certificate as it would be rendered on the main site.

If you are using this page during development, you may make use of the following bookmarklet to easily unhide the text field. Simply create a bookmark in your browser with the following string as the target, and clicking on it should unhide the text field.

```javascript
javascript:((function unhideCertStringField() { document.querySelector('#certificateContentsString').type="" })());
```

If you are embedding this page in your application, do note that no verification of the authenticity of the certificate is performed, it will even render certificates with nonsensical signature fields. You are expected to do your own verification and communicate the results to the user at your own discretion.

For more information on how to use this in an embedded capacity, you may refer to [this example](https://github.com/OpenCerts/rn-opencerts)

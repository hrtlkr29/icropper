/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
declare module 'cropperjs/dist/cropper.js' {
  import Cropper from 'cropperjs';
  export default Cropper;
}
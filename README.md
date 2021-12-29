# [Link demo, klik](https://peaceful-thompson-68dd81.netlify.app/)

# Ingfo
- Polygon dimuat secara manual. (get axios ke kml, lalu simpan di variable state sbg geoJSON). Baru dibuat polygon ke mapsnya. Bukan lewat <KMLLayer bawaan library). Alasannya adalah <KMLLayer/> sangat terbatas dan tidak bisa diextract setelah diload (atau tidak ada petunjuk yg jelas cara ekstraknya).
- Urutan di turf itu longitude terlebih dahulu, baru latitude. Jika ada array seperti ini [xxx, aaaa] maka xxx adalah longitude, dan aaaa adalah latitude. Harap berhati-hati jika menemukan Object.values dari array of object, pastikan key nya adalah lng terlebih dahulu, baru latitude.
- Penghitungan line, jarak dan sebagainya menggunakan turfjs.
- Tidak semua library turf dipakai, aku hanya pakai yg diperlukan saja. (Cek bagian import)
- Library maps menggunakan [@react-google-maps/api](https://www.npmjs.com/package/@react-google-maps/api), karena yang react-google-maps biasa sudah tidak dimaintain lagi. Tapi seharusnya fungsi2 nya masih sama krn @react-google-maps/api adalah versi rewrite dari react-google-maps.
- Dokumentasi @react-google-maps/api ada [di sini](https://react-google-maps-api-docs.netlify.app/)

# Thread atau referensi penting
- [turf js docs](https://turfjs.org/docs/).
- [github discussion/issue terkait ini](https://github.com/Turfjs/turf/issues/2002)
- 

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

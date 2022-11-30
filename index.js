import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
})

renderer.setPixelRatio( window.devicePixelRatio )
renderer.setSize( window.innerWidth, window.innerHeight )
camera.position.setZ(30)
camera.position.setX(-500)

//torus
const geometry = new THREE.TorusGeometry( 10, .5, 16, 100 )
const material = new THREE.MeshPhongMaterial( { color: "#103783" } )
material.wireframe = true
const torus = new THREE.Mesh(geometry, material)
scene.add(torus)

//lights
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(20, 20, 20)
const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(pointLight, ambientLight)
// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50)
//scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement)

function addStar() {
  const geometry = new THREE.SphereGeometry(.25, 24, 24)
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const star = new THREE.Mesh(geometry, material)

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))

  star.position.set(x, y, z)
  scene.add(star)
}

Array(200).fill().forEach(addStar)

//background
const spaceTexture = new THREE.TextureLoader().load('/assets/space_bg.jpg')
scene.background = spaceTexture

//mercury
const mercuryTexture= new THREE.TextureLoader().load('/assets/mercury.jpeg')
const mercuryNormal = new THREE.TextureLoader().load('assets/mercury_normal.jpeg')
const mercury = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshBasicMaterial({ 
    map: mercuryTexture,
    normalMap: mercuryNormal
  })
)
scene.add(mercury)

//moon
const moonTexture = new THREE.TextureLoader().load('/assets/moon.jpeg')
const moonNormal = new THREE.TextureLoader().load('/assets/moon_normal.jpeg')
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshPhongMaterial( {
    map: moonTexture,
    normalMap: moonNormal
  })
)
scene.add(moon)
moon.position.x = -10
moon.position.z = 30

//octahedron
const octShape = new THREE.OctahedronGeometry(5, 0)
const octMaterial = new THREE.MeshPhongMaterial( { color: "#ade8f4" } )
const oct = new THREE.Mesh(octShape, octMaterial)
scene.add(oct)
oct.position.x = 15
oct.position.z = 48

//dodecahedron
const dodShape = new THREE.DodecahedronGeometry(6, 1)
const dodMaterial = new THREE.MeshPhongMaterial( { color: "slategrey" } )
const dod = new THREE.Mesh(dodShape, dodMaterial)
scene.add(dod)
dod.position.x = -15
dod.position.y = -8
dod.position.z = 70

function moveCamera() {
  const t = document.body.getBoundingClientRect().top

  dod.rotation.y += .01
  dod.rotation.z += .01

  //camera.translateZ(-.1)
  camera.position.z = t * -.01
  camera.position.x = t * .0002
  camera.rotation.y = t * -.0002
}

document.body.onscroll = moveCamera
moveCamera()

function animate() {
  requestAnimationFrame(animate)

  // animate torus
  torus.rotation.x += .01
  torus.rotation.y += .005
  torus.rotation.z += .01

  // animate moon
  moon.rotation.x += .0025
  moon.rotation.y += .0038
  moon.rotation.z += .0025

  //animate mercury
  mercury.rotation.x += .0025
  mercury.rotation.y += .0038
  mercury.rotation.z += .0025

  //animate octahedral
  oct.rotation.x += -.01
  oct.rotation.y += -.01
  oct.rotation.z += -.01

  //dodecahedron movement
  dod.translateX(.01)

  controls.update()

  renderer.render(scene, camera)
}

animate()
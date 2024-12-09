
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffe4e1);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("scene-container").appendChild(renderer.domElement);

// كعكة ثلاثية الطبقات
const layers = [];

// الطبقة الأولى
const layer1 = createCakeLayer(1, 0.5, 0xff8fab, 0.5);
scene.add(layer1);
layers.push(layer1);

// الطبقة الثانية
const layer2 = createCakeLayer(0.8, 0.4, 0xffd1dc, 1);
scene.add(layer2);
layers.push(layer2);

// الطبقة الثالثة
const layer3 = createCakeLayer(0.6, 0.3, 0xccccff, 1.5);
scene.add(layer3);
layers.push(layer3);

// إضافة شموع بشخصيات هيلو كيتي
addCharacterCandles(layer3);

// إضاءة
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 5, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

// وظيفة لإنشاء طبقة كعكة
function createCakeLayer(radius, height, color, yPosition) {
  const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
  const material = new THREE.MeshStandardMaterial({ color: color });
  const layer = new THREE.Mesh(geometry, material);
  layer.position.y = yPosition;
  return layer;
}

// وظيفة لإضافة شموع شخصيات
function addCharacterCandles(layer) {
  const characters = ['kuromi.png', 'hellokitty.png', 'myelody.png'];
  const positions = [-0.4, 0, 0.4];

  characters.forEach((character, index) => {
    const texture = new THREE.TextureLoader().load(`images/${character}`);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const geometry = new THREE.PlaneGeometry(0.3, 0.4);
    const candle = new THREE.Mesh(geometry, material);
    candle.position.set(positions[index], layer.position.y + 0.5, 0);
    candle.rotation.y = Math.PI / 2;
    scene.add(candle);
  });
}

// الضغط على الكعكة
let clickCount = 0;
document.getElementById("interact-btn").addEventListener("click", () => {
  clickCount++;
  if (clickCount <= 2) {
    eatCake();
  } else if (clickCount === 3) {
    explodeCake();
  }
});

function eatCake() {
  const randomLayer = layers.pop();
  if (randomLayer) scene.remove(randomLayer);
}

function explodeCake() {
  layers.forEach(layer => scene.remove(layer));
  showGift();
}

// عرض الهدية
let gift;
function showGift() {
  const giftGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
  const giftMaterial = new THREE.MeshStandardMaterial({ color: 0xffc0cb });
  gift = new THREE.Mesh(giftGeometry, giftMaterial);
  gift.position.set(0, 1, 0);
  scene.add(gift);

  const ribbonGeometry = new THREE.PlaneGeometry(0.8, 0.2);
  const ribbonMaterial = new THREE.MeshBasicMaterial({ color: 0xff69b4 });
  const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
  ribbon.position.set(0, 1.4, 0.01);
  gift.add(ribbon);

  gift.userData.clicked = 0;

  gift.addEventListener = () => {
    gift.userData.clicked++;
    if (gift.userData.clicked === 1) {
      ribbon.visible = false;
    } else if (gift.userData.clicked === 2) {
      explodeGift();
    }
  };
}

// تفجير الهدية وإطلاق البالونات
function explodeGift() {
  scene.remove(gift);
  releaseBalloons();
  showMessage();
}

function releaseBalloons() {
  const colors = [0xffc0cb, 0xffb6c1, 0xffff00, 0x87cefa, 0xb0e0e6];
  for (let i = 0; i < 20; i++) {
    const balloonGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const balloonMaterial = new THREE.MeshStandardMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
    });
    const balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);
    balloon.position.set(Math.random() * 2 - 1, -1, Math.random() * 2 - 1);
    scene.add(balloon);
  }
}

function showMessage() {
  const message = document.createElement('div');
  message.innerHTML = `<h1>🎉 يوم ميلادك سعيد يا أروى! كل عام وأنت بخير!<br><i>Sd</i></h1>`;
  message.style.position = 'absolute';
  message.style.top = '50%';
  message.style.left = '50%';
  message.style.transform = 'translate(-50%, -50%)';
  message.style.color = '#ff69b4';
  message.style.fontSize = '2rem';
  document.body.appendChild(message);
}

// تشغيل الأنيميشن
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

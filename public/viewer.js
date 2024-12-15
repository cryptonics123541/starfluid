let scene, camera, renderer, controls, model;
let isInitialized = false;

async function initViewer() {
    console.log('Initializing viewer...');
    if (isInitialized) return;
    
    try {
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a192f);

        // Setup camera
        const container = document.getElementById('model-container');
        const aspect = container.clientWidth / container.clientHeight;
        camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        camera.position.set(0, 0, 5);

        // Setup renderer
        renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x0a192f, 1);
        container.innerHTML = ''; // Clear any existing content
        container.appendChild(renderer.domElement);

        // Add lights
        const lights = [
            new THREE.AmbientLight(0xffffff, 2),
            new THREE.DirectionalLight(0xffffff, 3),
            new THREE.DirectionalLight(0xffffff, 2),
            new THREE.PointLight(0xffffff, 1)
        ];

        lights[1].position.set(5, 5, 5);
        lights[2].position.set(-5, -5, -5);
        lights[3].position.set(0, 2, 2);
        lights.forEach(light => scene.add(light));

        // Setup controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = true;
        controls.minDistance = 0.5;
        controls.maxDistance = 10;
        controls.update();

        // Load model
        console.log('Loading model...');
        const loader = new GLTFLoader();
        
        const gltf = await loader.loadAsync('/models/harbinger.glb');
        console.log('Model loaded:', gltf);
        
        model = gltf.scene;
        
        // Center and scale model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        model.scale.multiplyScalar(scale);

        scene.add(model);

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        // Handle resize
        window.addEventListener('resize', onWindowResize, false);
        
        isInitialized = true;
        console.log('Viewer initialized successfully');
    } catch (error) {
        console.error('Error in initViewer:', error);
    }
}

function onWindowResize() {
    const container = document.getElementById('model-container');
    if (!container || !camera || !renderer) return;
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function toggleSchematicViewer() {
    const viewer = document.getElementById('schematicViewer');
    if (!viewer) return;
    
    if (viewer.style.display === 'none' || !viewer.style.display) {
        viewer.style.display = 'flex';
        if (!isInitialized) {
            initViewer();
        }
    } else {
        viewer.style.display = 'none';
    }
}
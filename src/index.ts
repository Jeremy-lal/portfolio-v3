import * as THREE from 'three';
import gsap from 'gsap'

const projects = [
    {
        id: 1,
        name: 'Helioth',
        img: 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1510&q=80'
    },
    {
        id: 2,
        name: 'Helioth',
        img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1680&q=80'
    },
    {
        id: 3,
        name: 'Helioth',
        img: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
    },
    {
        id: 4,
        name: 'Helioth',
        img: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
    },
]

const vertexShader = `
uniform float uTime;
varying vec2 vuv;
float PI = 3.141592653589793238;

void main() {
 vuv = (uv - vec2(0.5))*0.9 + vec2(0.5);
    vec3 pos= position;
    pos.y += sin(PI*uv.x)*0.03;
    pos.z += sin(PI*uv.x)*0.03;
    pos.y += sin(uTime) * 0.02;
    vuv.y -= sin(uTime) * 0.02;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;
const fragmentShader = `
uniform sampler2D uImage;
uniform float opacity;
varying vec2 vuv;

void main() {
    vec4 color = texture2D(uImage, vuv);
    gl_FragColor = color;
    gl_FragColor.a = opacity; 
}
`;

document.addEventListener('DOMContentLoaded', () => {
    const prev = document.getElementById('prev')
    const next = document.getElementById('next')
    const projetDiv = Array.from(document.getElementsByClassName('project') as HTMLCollectionOf<HTMLElement>)
    projetDiv[0].style.display = 'block'

    const canvas = document.getElementById('webgl')
    const sizes = { width: window.innerWidth / 2, height: window.innerHeight }

    const scene = new THREE.Scene();

    /** Textures */
    const textures = [];

    const textureLoader = new THREE.TextureLoader();
    projects.forEach(el => {
        textures.push(textureLoader.load(el.img))
    })
    // console.log(textures);


    /** camera **/
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 30);
    camera.position.set(1, (projects.length - 1) * 1.2, 1.4);


    /**Planes**/

    const group = new THREE.Group();
    const plane = new THREE.PlaneGeometry(1.5, 1.1, 20, 20);

    function createPlane(image) {
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            uniforms: {
                uImage: { value: image },
                uTime: { value: 0 },
                opacity: { value: 1 }
            }
        });

        const mesh = new THREE.Mesh(plane, material);
        return mesh;
    }

    const planes = []

    textures.forEach(el => {
        const newPlane = createPlane(el);
        planes.push(newPlane);
        group.add(newPlane)
    })

    scene.add(group);

    planes.forEach((el, i) => {
        el.position.y = i * 1.2;
    })

    group.rotation.y = -0.3;
    group.rotation.x = -0.2;
    group.rotation.z = -0.3;

    /**Renderer**/
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.render(scene, camera)


    /** Animate **/
    const clock = new THREE.Clock();

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        for (let plane of planes) {
            plane.material.uniforms.uTime.value = elapsedTime;

            if (plane.position.y <= camera.position.y + 0.2 && plane.position.y >= camera.position.y - 0.2) {
                gsap.to(plane.scale, { y: 1.1, x: 1.1, z: 1.1, duration: 0.8 })
                gsap.to(plane.material.uniforms.opacity, { value: 1, duration: 0.8 });
            } else {
                gsap.to(plane.scale, { y: 1, x: 1, z: 1, duration: 0.8 })
                gsap.to(plane.material.uniforms.opacity, { value: 0.2, duration: 0.8 });
            }
        }

        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    }

    tick();

    /** Events **/
    let animating = false;
    let projectNum = 0;

    prev.addEventListener('click', () => changeProject('prev'))
    next.addEventListener('click', () => changeProject('next'))


    function changeProject(button) {
        console.log(projetDiv);

        if (animating) {
            return false;
        }

        const prevProject = projectNum;

        const maxCamera = (textures.length - 1) * 1.2;
        if (button === 'prev') {
            if (camera.position.y < maxCamera) {
                animating = true;
                gsap.to(camera.position, { y: '+=1.2', x: '+=0.2', z: '-=0.2', duration: 0.8, onComplete: () => animating = false });
                projectNum--
                changeDescription(prevProject)
            }
        } else {
            if (camera.position.y > 1) {
                animating = true;
                gsap.to(camera.position, { y: '-=1.2', x: '-=0.2', z: '+=0.2', duration: 0.8, onComplete: () => animating = false });
                projectNum++
                changeDescription(prevProject)
            }
        }

        function changeDescription(prev) {
            projetDiv[prev].style.display = 'none'
            projetDiv[projectNum].style.display = 'block'
        }





    }


    window.addEventListener('resize', () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        // Update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    })
})
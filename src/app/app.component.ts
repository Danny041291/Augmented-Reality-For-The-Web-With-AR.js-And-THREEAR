import { Component, AfterViewInit } from '@angular/core';
import * as THREEAR from "threear";
import * as THREE from "three";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'app';

  ngAfterViewInit() {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setClearColor(new THREE.Color('lightgrey'), 0)
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0px'
    renderer.domElement.style.left = '0px'
    document.getElementById('content').appendChild(renderer.domElement);

    // Initialise the three.js scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    scene.add(camera);

    const markerGroup = new THREE.Group();
    scene.add(markerGroup);

    var source = new THREEAR.Source({ renderer, camera });

    THREEAR.initialize({ source: source }).then((controller) => {

      // Add a torus knot       
      const geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);
      const material = new THREE.MeshNormalMaterial();
      const torus = new THREE.Mesh(geometry, material);
      torus.position.y = 0.5
      markerGroup.add(torus);

      var patternMarker = new THREEAR.PatternMarker({
        patternUrl: 'assets/hiro.patt', // the URL of the hiro pattern
        markerObject: markerGroup,
        minConfidence: 0.4 // The confidence level before the marker should be shown
      });

      controller.trackMarker(patternMarker);

      // run the rendering loop
      let lastTimeMilliseconds = 0;
      requestAnimationFrame(function animate(nowMsec) {
        // keep looping
        requestAnimationFrame(animate);
        // measure time
        lastTimeMilliseconds = lastTimeMilliseconds || nowMsec - 1000 / 60;
        const deltaMillisconds = Math.min(200, nowMsec - lastTimeMilliseconds);
        lastTimeMilliseconds = nowMsec;

        // call each update function
        controller.update(source.domElement);

        torus.rotation.y += deltaMillisconds / 1000 * Math.PI
        torus.rotation.z += deltaMillisconds / 1000 * Math.PI
        renderer.render(scene, camera);
      });

    });
  }

}

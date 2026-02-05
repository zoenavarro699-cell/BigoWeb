import * as faceapi from 'face-api.js';

// Load models from local public directory
const MODEL_URL = '/models';

export async function loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    // We might not need recognition for now, just detection
}

export type BiometricResult = {
    age: number;
    gender: 'male' | 'female';
    score: number;
};

export async function detectFace(imageElement: HTMLImageElement | HTMLVideoElement): Promise<BiometricResult | null> {
    const detection = await faceapi.detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withAgeAndGender();

    if (!detection) return null;

    return {
        age: Math.round(detection.age),
        gender: detection.gender === 'male' ? 'male' : 'female',
        score: detection.detection.score
    };
}

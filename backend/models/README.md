# Lipika AI — Trained Brahmi Model Artifacts

This directory stores trained model files for the Brahmi neural classifier:

- `lipika_brahmi_model.keras` — Trained TensorFlow/Keras CNN classifier for Ashokan & Post-Mauryan Brahmi script.

The backend loads this model ONCE during FastAPI lifespan startup to handle high-throughput inference requests.

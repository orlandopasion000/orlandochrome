import os
import shutil

src_dir = r"C:\Users\Orlando\.gemini\antigravity\brain\e83a350b-4cd7-450c-b9f0-cd724a72858f\browser_sandbox\screenshots"
dst_dir = r"C:\Users\Orlando\.gemini\antigravity\brain\15adc93a-4633-48b3-91ab-72d7cbd3f039\live_evidence"
os.makedirs(dst_dir, exist_ok=True)

shots = [
    ("step_56_shot_1.png", "Evidence_Dynamo_VI_CloseUp_Blink_Mouth.png"),
    ("step_56_shot_2.png", "Evidence_Meteor_VI_CloseUp_Head_Detail.png"),
    ("step_56_shot_3.png", "Evidence_Meteor_VI_Silhouette_Lightbox.png"),
    ("step_56_shot_4.png", "Evidence_Dynamo_VI_Silhouette_Lightbox.png"),
    ("step_52_shot_1.png", "Evidence_Course_Phase5_Braking_Flare.png"),
    ("step_52_shot_3.png", "Evidence_Course_Phase6_Hover_Restored.png"),
    ("step_26_shot_1.png", "Evidence_Dynamo_Flux_Pulse_Discharge.png"),
    ("step_26_shot_2.png", "Evidence_Meteor_Flux_Pulse_Jaw_Roar.png"),
    ("step_19_shot_1.png", "Evidence_Dynamo_Midpoint_Pause_3D_Volume.png"),
    ("step_13_shot_1.png", "Evidence_Dynamo_Sustained_Left_L34.png"),
    ("step_6_shot_1.png", "Evidence_Dynamo_Sustained_Right_R34.png"),
    ("step_37_shot_1.png", "Evidence_Helix_Unicorn_Canter_Left_Lead.png"),
    ("step_37_shot_2.png", "Evidence_Meteor_Dragon_Left_Flight_Claws_Tucked.png"),
    ("step_37.png", "Evidence_Meteor_Dragon_Right_Flight_Hover.png")
]

for src_name, dst_name in shots:
    s = os.path.join(src_dir, src_name)
    d = os.path.join(dst_dir, dst_name)
    if os.path.exists(s):
        shutil.copy2(s, d)
        print(f"Copied {src_name} -> {dst_name}")

print("All live evidence screenshots successfully staged!")

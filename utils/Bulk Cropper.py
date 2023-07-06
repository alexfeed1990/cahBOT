from PIL import Image
from tkinter import filedialog
from tkinter import messagebox
import tkinter as tk
import os
print("Please select a folder.")
window = tk.Tk()
label = tk.Label(text="Bulk Image Cropper")
areaLabel = tk.Label(text="Area to Crop (ex: '1,1,0,0')")
areaText = tk.Entry(window, bd = 5)
area = areaText.get()
window.update()
folder_selected = filedialog.askdirectory()
def crop():
    files = os.listdir(folder_selected)
    for i in files:
        path = os.path.join(folder_selected, i)
        img = Image.open(path)
        shit = areaText.get().split(",")
        box = (int(shit[0]), int(shit[1]), int(shit[2]) + int(shit[0]), int(shit[3]) + int(shit[1]))
        print(box)
        img2 = img.crop(box)
        img2.save(path)
        img.close()
    window.update()
    messagebox.showinfo("Done!", "Images cropped.")
crop = tk.Button(text="Crop the Images", command=crop)
label.pack()
areaLabel.pack()
areaText.pack()
crop.pack()
window.mainloop()

import base64


def image_to_base64(image_path):
    try:
        with open(image_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read())
            # print(encoded_string.decode("utf-8"))
            open('UBookDesktop.txt', 'wb').write(encoded_string)
    except FileNotFoundError:
        print(f"File not found: {image_path}")
    except Exception as e:
        print(f"An error occurred: {e}")


# Example usage
image_path = "../assets/UBookDesktop.png"  # Replace with your image path
image_to_base64(image_path)

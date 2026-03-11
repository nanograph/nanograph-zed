use zed_extension_api as zed;

struct NanographExtension;

impl zed::Extension for NanographExtension {
    fn new() -> Self {
        Self
    }
}

zed::register_extension!(NanographExtension);

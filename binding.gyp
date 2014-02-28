{
  "targets": [
    {
      "target_name": "fb",
      "sources": [ "fb.cc" ],
	  "include_dirs": ["./include"],
	  "libraries": ["-L../lib",'-lfastbit'],
      "cflags!": [ '-fno-exceptions' ],
      "cflags_cc!": [ '-fno-exceptions' ],
	  "conditions": [
		  ['OS=="mac"', {
			  'xcode_settings': {
				  'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
			  }
		  }]
	  ]
    }
  ]
}

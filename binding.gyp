{
  "targets": [
    {
      "target_name": "fb",
      "sources": [ "fb.cc" ],
	  "include_dirs": ["./include"],
	  "libraries": ["-L../lib",'-lfastbit'],
      "cflags_cc": [ '-stdlib=libc++' ],
      "cflags!": [ '-fno-exceptions' ],
      "cflags_cc!": [ '-fno-exceptions' ],
	  "conditions": [
		  ['OS=="mac"', {
			  'xcode_settings': {
				  'OTHER_CPLUSPLUSFLAGS' : ['-mmacosx-version-min=10.7','-stdlib=libc++'],
                  'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
			  }
		  }]
	  ]
    }
  ]
}

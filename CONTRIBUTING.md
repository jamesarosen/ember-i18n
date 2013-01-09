## Running the tests

You'll need Ruby 1.9, [Rake](http://rake.rubyforge.org/),
[Bundler](http://gembundler.com/), and
[Bower](http://twitter.github.com/bower/).

```bash
bower install
bundle
rake
```

`rake -T` will show available Rake tasks, including test-running tasks.

## Changing `dist/`

Please only change the files in `dist/` by running the `build:*` Rake commands,
and only when bumping the version of the library. Specifically, commits that
change `lib/` should *not* have corresponding changes in `dist/`.

## Commit-Bit Policy

If a commit of yours lands in the `master` branch, you've earned committer
rights. If you would like to be added to the contributors list, please say
so in your pull request or email me.

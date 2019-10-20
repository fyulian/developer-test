|BTPN Wow! Source Code|| 
|---|---| 
|Filename|D:\- COB Wow\Wow SC\money-master\sql\src\main\java\com\btpnwow\core\sql\Main.java| 
|Print Date|2019-10-15 | 
--- 
```java {.line-numbers} 
package com.btpnwow.brand.sql;

import java.io.Closeable;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;

import liquibase.Contexts;
import liquibase.LabelExpression;
import liquibase.Liquibase;
import liquibase.database.jvm.JdbcConnection;
import liquibase.logging.LogFactory;
import liquibase.logging.LogLevel;
import liquibase.resource.ClassLoaderResourceAccessor;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;

public class Main implements Closeable {
	
	private static final SimpleDateFormat TIMESTAMP_FMT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
	
	private Connection dbconn;
	
	private Liquibase liquibase;
	
	private String action;
	
	private String[] args;
	
	private void showHelp(String errorMessage, Options opts) {
		if (errorMessage != null) {
			errorMessage = errorMessage.trim();
			
			if (!errorMessage.isEmpty()) {
				System.err.println(errorMessage);
				System.err.println();
			}
		}
		
		final HelpFormatter fmt = new HelpFormatter();
		
		final PrintWriter pw = new PrintWriter(System.err);
		try {
			fmt.printHelp(pw, fmt.getWidth(),
					"com.btpnwow.core.sql [options] <action> [args...]",
					null, opts,
					fmt.getLeftPadding(), fmt.getDescPadding(), null, false);
		} finally {
			pw.flush();
		}
	}
	
	private CommandLine parse(String[] args) {
		final CommandLineParser parser = new DefaultParser();
		
		final Options opts = new Options();
		
		opts.addOption(Option.builder()
				.longOpt("driver")
				.required(false)
				.argName("classname")
				.hasArg(true)
				.numberOfArgs(1)
				.optionalArg(false)
				.type(String.class)
				.desc("jdbc driver")
				.build());
		
		opts.addOption(Option.builder()
				.longOpt("url")
				.required(false)
				.argName("url")
				.hasArg(true)
				.numberOfArgs(1)
				.optionalArg(false)
				.type(String.class)
				.desc("jdbc url")
				.build());
		
		opts.addOption(Option.builder("u")
				.longOpt("username")
				.required(false)
				.argName("username")
				.hasArg(true)
				.numberOfArgs(1)
				.optionalArg(false)
				.type(String.class)
				.desc("database connection username")
				.build());
		
		opts.addOption(Option.builder("p")
				.longOpt("password")
				.required(false)
				.argName("password")
				.hasArg(true)
				.numberOfArgs(1)
				.optionalArg(false)
				.type(String.class)
				.desc("database connection password")
				.build());
		
		opts.addOption(Option.builder("e")
				.required(false)
				.argName("jdbc-properties")
				.hasArg(true)
				.numberOfArgs(2)
				.optionalArg(false)
				.valueSeparator('=')
				.desc("custom jdbc properties")
				.build());
		
		// parse
		final CommandLine cmds;
		
		try {
			cmds = parser.parse(opts, args, false);
		} catch (ParseException ex) {
			showHelp(ex.getMessage(), opts);
			return null;
		}
		
		final String[] fargs = cmds.getArgs();
		if (fargs.length != 2) {
			showHelp(null, opts);
			return null;
		}
		
		action = fargs[0];
		
		if (!"update".equalsIgnoreCase(action) &&
				!"rollback-to-tag".equalsIgnoreCase(action) &&
				!"rollback-to-date".equalsIgnoreCase(action)) {
			
			showHelp("unrecognized action `" + action +
					"`, should be either `update`, `rollback-to-tag`, or `rollback-to-date`",
					opts);
			
			return null;
		}
		
		if (fargs.length == 1) {
			this.args = new String[0];
		} else {
			this.args = new String[fargs.length - 1];
			System.arraycopy(fargs, 1, this.args, 0, this.args.length);
		}
		
		return cmds;
	}
	
	private void init(CommandLine cmds) throws Exception {
		// database connection
		final String driver;
		
		if (cmds.hasOption("driver")) {
			driver = cmds.getOptionValue("driver");
		} else {
			driver = System.getProperty("DATABASE_DRIVER", System.getenv("DATABASE_DRIVER"));
		}
		
		if ((driver != null) && !driver.trim().isEmpty()) {
			Class.forName(driver.trim());
		}
		
		final Properties dbprop = new Properties();
		
		if (cmds.hasOption("e")) {
			final Properties cmdprop = cmds.getOptionProperties("e");
			
			if (cmdprop != null) {
				dbprop.putAll(cmdprop);
			}
		}
		
		final String user;
		
		if (cmds.hasOption("u") || cmds.hasOption("username")) {
			user = cmds.getOptionValue("u", cmds.getOptionValue("username"));
		} else {
			user = System.getProperty("DATABASE_USERNAME", System.getenv("DATABASE_USERNAME"));
		}
		
		if (user != null) {
			dbprop.put("user", user);
		}
		
		final String password;
		
		if (cmds.hasOption("p") || cmds.hasOption("password")) {
			password = cmds.getOptionValue("p", cmds.getOptionValue("password"));
		} else {
			password = System.getProperty("DATABASE_PASSWORD", System.getenv("DATABASE_PASSWORD"));
		}
		
		if (password != null) {
			dbprop.put("password", password);
		}
		
		dbconn = DriverManager.getConnection(cmds.getOptionValue("url"), dbprop);
		
		// liquibase
		LogFactory.getInstance().setDefaultLoggingLevel(LogLevel.DEBUG);
		
		liquibase = new Liquibase(
				"META-INF/sql/com/btpnwow/brand/sql/changelog-master.xml",
				new ClassLoaderResourceAccessor(), new JdbcConnection(dbconn));
		
		liquibase.setIgnoreClasspathPrefix(false);
	}
	
	private void rollbackToTag() throws Exception {
		if (args.length == 0) {
			throw new IllegalArgumentException("tag is required");
		}
		
		final String tagName = args[0];
		
		if (liquibase.tagExists(tagName)) {
			liquibase.rollback(tagName, new Contexts());
		}
	}
	
	private void rollbackToDate() throws Exception {
		if (args.length == 0) {
			throw new IllegalArgumentException("date is required");
		}
		
		final Date date;
		
		try {
			date = TIMESTAMP_FMT.parse(args[0]);
		} catch (java.text.ParseException ex) {
			throw new IllegalArgumentException(
					"invalid date, must in format `yyyy-MM-dd'T'HH:mm:ss` " +
					"(e.g. 2017-12-15T10:23:00)");
		}
		
		liquibase.rollback(date, new Contexts(), new LabelExpression());
	}
	
	private void update() throws Exception {
		final String tagName;
		
		if (args.length > 0) {
			tagName = args[0];
		} else {
			tagName = null;
		}
		
		// rollback before changes to tag
		if ((tagName != null) && liquibase.tagExists(tagName)) {
			liquibase.rollback(tagName, new Contexts());
		}
		
		// apply changes
        liquibase.update(new Contexts(), new LabelExpression());
		
		// tag after changes
		if (tagName != null) {
			liquibase.tag(tagName);
		}
	}
	
	public void run(String[] args) throws Exception {
		// parse args
		final CommandLine cmds = parse(args);
		if (cmds == null) {
			System.exit(1);
		}
		
		// init
		init(cmds);
		
		if ("update".equalsIgnoreCase(action)) {
			update();
		} else if ("rollback-to-tag".equalsIgnoreCase(action)) {
			rollbackToTag();
		} else if ("rollback-to-date".equalsIgnoreCase(action)) {
			rollbackToDate();
		}
		
		// commit
		if (!dbconn.getAutoCommit()) {
			dbconn.commit();
		}
	}

	@Override
	public void close() throws IOException {
		if (dbconn != null) {
			try {
				dbconn.close();
			} catch (Throwable ex) {
				// suppress
			}
		}
	}
	
	public static void main(String[] args) throws Exception {
		int exitCode = 0;
		
		final Main m = new Main();
		
		try {
			m.run(args);
		} catch (IllegalArgumentException ex) {
			if (ex.getMessage() != null) {
				System.err.println(ex.getMessage());
			}
			
			exitCode = 1;
		} finally {
			try {
				m.close();
			} catch (Throwable ex) {
				// suppress
			}
		}
		
		if (exitCode != 0) {
			System.exit(exitCode);
		}
	}
}
``` 
<div style='page-break-after: always;'></div> 
--- 
|BTPN Wow! Source Code|| 
|---|---| 
|Filename|D:\- COB Wow\Wow SC\money-master\sql\src\main\java\com\btpnwow\core\sql\Main.java| 
|Print Date|2019-10-15 | 
--- 
```java {.line-numbers} 
package com.btpnwow.core.sql;

import java.io.Closeable;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;

import liquibase.Contexts;
import liquibase.LabelExpression;
import liquibase.Liquibase;
import liquibase.database.jvm.JdbcConnection;
import liquibase.logging.LogFactory;
import liquibase.logging.LogLevel;
import liquibase.resource.ClassLoaderResourceAccessor;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;

public class Main implements Closeable {
	
	private static final SimpleDateFormat TIMESTAMP_FMT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
	
	private Connection dbconn;
	
	private Liquibase liquibase;
	
	private String action;
	
	private String[] args;
	
	private void showHelp(String errorMessage, Options opts) {
		if (errorMessage != null) {
			errorMessage = errorMessage.trim();
			
			if (!errorMessage.isEmpty()) {
				System.err.println(errorMessage);
				System.err.println();
			}
		}
		
		final HelpFormatter fmt = new HelpFormatter();
		
		final PrintWriter pw = new PrintWriter(System.err);
		try {
			fmt.printHelp(pw, fmt.getWidth(),
					"com.btpnwow.core.sql [options] <action> [args...]",
					null, opts,
					fmt.getLeftPadding(), fmt.getDescPadding(), null, false);
		} finally {
			pw.flush();
		}
	}
	
	private CommandLine parse(String[] args) {
		final CommandLineParser parser = new DefaultParser();
		
		final Options opts = new Options();
		
		opts.addOption(Option.builder()
				.longOpt("driver")
				.required(false)
				.argName("classname")
				.hasArg(true)
				.numberOfArgs(1)
				.optionalArg(false)
				.type(String.class)
				.desc("jdbc driver")
				.build());
		
		opts.addOption(Option.builder()
				.longOpt("url")
				.required(false)
				.argName("url")
				.hasArg(true)
				.numberOfArgs(1)
				.optionalArg(false)
				.type(String.class)
				.desc("jdbc url")
				.build());
		
		opts.addOption(Option.builder("u")
				.longOpt("username")
				.required(false)
				.argName("username")
				.hasArg(true)
				.numberOfArgs(1)
				.optionalArg(false)
				.type(String.class)
				.desc("database connection username")
				.build());
		
		opts.addOption(Option.builder("p")
				.longOpt("password")
				.required(false)
				.argName("password")
				.hasArg(true)
				.numberOfArgs(1)
				.optionalArg(false)
				.type(String.class)
				.desc("database connection password")
				.build());
		
		opts.addOption(Option.builder("e")
				.required(false)
				.argName("jdbc-properties")
				.hasArg(true)
				.numberOfArgs(2)
				.optionalArg(false)
				.valueSeparator('=')
				.desc("custom jdbc properties")
				.build());
		
		// parse
		final CommandLine cmds;
		
		try {
			cmds = parser.parse(opts, args, false);
		} catch (ParseException ex) {
			showHelp(ex.getMessage(), opts);
			return null;
		}
		
		final String[] fargs = cmds.getArgs();
		if (fargs.length != 2) {
			showHelp(null, opts);
			return null;
		}
		
		action = fargs[0];
		
		if (!"update".equalsIgnoreCase(action) &&
				!"rollback-to-tag".equalsIgnoreCase(action) &&
				!"rollback-to-date".equalsIgnoreCase(action)) {
			
			showHelp("unrecognized action `" + action +
					"`, should be either `update`, `rollback-to-tag`, or `rollback-to-date`",
					opts);
			
			return null;
		}
		
		if (fargs.length == 1) {
			this.args = new String[0];
		} else {
			this.args = new String[fargs.length - 1];
			System.arraycopy(fargs, 1, this.args, 0, this.args.length);
		}
		
		return cmds;
	}
	
	private void init(CommandLine cmds) throws Exception {
		// database connection
		final String driver;
		
		if (cmds.hasOption("driver")) {
			driver = cmds.getOptionValue("driver");
		} else {
			driver = System.getProperty("DATABASE_DRIVER", System.getenv("DATABASE_DRIVER"));
		}
		
		if ((driver != null) && !driver.trim().isEmpty()) {
			Class.forName(driver.trim());
		}
		
		final Properties dbprop = new Properties();
		
		if (cmds.hasOption("e")) {
			final Properties cmdprop = cmds.getOptionProperties("e");
			
			if (cmdprop != null) {
				dbprop.putAll(cmdprop);
			}
		}
		
		final String user;
		
		if (cmds.hasOption("u") || cmds.hasOption("username")) {
			user = cmds.getOptionValue("u", cmds.getOptionValue("username"));
		} else {
			user = System.getProperty("DATABASE_USERNAME", System.getenv("DATABASE_USERNAME"));
		}
		
		if (user != null) {
			dbprop.put("user", user);
		}
		
		final String password;
		
		if (cmds.hasOption("p") || cmds.hasOption("password")) {
			password = cmds.getOptionValue("p", cmds.getOptionValue("password"));
		} else {
			password = System.getProperty("DATABASE_PASSWORD", System.getenv("DATABASE_PASSWORD"));
		}
		
		if (password != null) {
			dbprop.put("password", password);
		}
		
		dbconn = DriverManager.getConnection(cmds.getOptionValue("url"), dbprop);
		
		// liquibase
		LogFactory.getInstance().setDefaultLoggingLevel(LogLevel.DEBUG);
		
		liquibase = new Liquibase(
				"META-INF/sql/com/btpnwow/core/sql/changelog-master.xml",
				new ClassLoaderResourceAccessor(), new JdbcConnection(dbconn));
		
		liquibase.setIgnoreClasspathPrefix(false);
	}
	
	private void rollbackToTag() throws Exception {
		if (args.length == 0) {
			throw new IllegalArgumentException("tag is required");
		}
		
		final String tagName = args[0];
		
		if (liquibase.tagExists(tagName)) {
			liquibase.rollback(tagName, new Contexts());
		}
	}
	
	private void rollbackToDate() throws Exception {
		if (args.length == 0) {
			throw new IllegalArgumentException("date is required");
		}
		
		final Date date;
		
		try {
			date = TIMESTAMP_FMT.parse(args[0]);
		} catch (java.text.ParseException ex) {
			throw new IllegalArgumentException(
					"invalid date, must in format `yyyy-MM-dd'T'HH:mm:ss` " +
					"(e.g. 2017-12-15T10:23:00)");
		}
		
		liquibase.rollback(date, new Contexts(), new LabelExpression());
	}
	
	private void update() throws Exception {
		final String tagName;
		
		if (args.length > 0) {
			tagName = args[0];
		} else {
			tagName = null;
		}
		
		// rollback before changes to tag
		if ((tagName != null) && liquibase.tagExists(tagName)) {
			liquibase.rollback(tagName, new Contexts());
		}
		
		// apply changes
        liquibase.update(new Contexts(), new LabelExpression());
		
		// tag after changes
		if (tagName != null) {
			liquibase.tag(tagName);
		}
	}
	
	public void run(String[] args) throws Exception {
		// parse args
		final CommandLine cmds = parse(args);
		if (cmds == null) {
			System.exit(1);
		}
		
		// init
		init(cmds);
		
		if ("update".equalsIgnoreCase(action)) {
			update();
		} else if ("rollback-to-tag".equalsIgnoreCase(action)) {
			rollbackToTag();
		} else if ("rollback-to-date".equalsIgnoreCase(action)) {
			rollbackToDate();
		}
		
		// commit
		if (!dbconn.getAutoCommit()) {
			dbconn.commit();
		}
	}

	@Override
	public void close() throws IOException {
		if (dbconn != null) {
			try {
				dbconn.close();
			} catch (Throwable ex) {
				// suppress
			}
		}
	}
	
	public static void main(String[] args) throws Exception {
		int exitCode = 0;
		
		final Main m = new Main();
		
		try {
			m.run(args);
		} catch (IllegalArgumentException ex) {
			if (ex.getMessage() != null) {
				System.err.println(ex.getMessage());
			}
			
			exitCode = 1;
		} finally {
			try {
				m.close();
			} catch (Throwable ex) {
				// suppress
			}
		}
		
		if (exitCode != 0) {
			System.exit(exitCode);
		}
	}
}
``` 
<div style='page-break-after: always;'></div> 
--- 
